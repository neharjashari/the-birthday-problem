import { useEffect, useState } from 'react';
import { decodeVote, sseUrl } from '../lib/live';

export { sendVote } from '../lib/live';

export type LinkStatus = 'connecting' | 'live' | 'error';

/** Wait before reconnecting after the stream was closed (ms), growing with each failure. */
const RECONNECT_MS = [1000, 2000, 5000, 10000];

/**
 * Subscribes to a room's ntfy topic (Server-Sent Events). `since=all` replays the
 * messages ntfy keeps cached (about 12 h), so a reloaded projector loses nothing.
 *
 * The browser reconnects a dropped stream on its own, but gives up for good after an
 * HTTP error such as 429 (rate limit). Then we reconnect ourselves, continuing from the
 * last message seen, and also as soon as the laptop is back online.
 */
export function useLiveVotes(room: string) {
  const [votes, setVotes] = useState<Array<{ voter: string; day: number }>>([]);
  const [status, setStatus] = useState<LinkStatus>('connecting');

  useEffect(() => {
    setVotes([]);
    setStatus('connecting');
    const seen = new Set<string>();
    let lastId: string | null = null;
    let es: EventSource | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    let disposed = false;

    const connect = () => {
      clearTimeout(timer);
      es?.close();
      const source = new EventSource(sseUrl(room, lastId ?? 'all'));
      es = source;
      source.onopen = () => {
        failures = 0;
        setStatus('live');
      };
      source.onmessage = (e: MessageEvent<string>) => {
        try {
          const msg = JSON.parse(e.data) as { id?: string; event?: string; message?: string };
          if (msg.event !== 'message' || !msg.id || seen.has(msg.id)) return;
          seen.add(msg.id);
          lastId = msg.id;
          const vote = decodeVote(msg.message ?? '');
          if (vote) setVotes((v) => [...v, vote]);
        } catch {
          /* ignore malformed events */
        }
      };
      source.onerror = () => {
        if (source.readyState !== EventSource.CLOSED) {
          setStatus('connecting'); // the browser is already retrying
          return;
        }
        setStatus('error');
        if (!disposed) timer = setTimeout(connect, RECONNECT_MS[Math.min(failures++, RECONNECT_MS.length - 1)]);
      };
    };

    const onOnline = () => {
      if (es?.readyState === EventSource.CLOSED) connect();
    };

    connect();
    window.addEventListener('online', onOnline);
    return () => {
      disposed = true;
      clearTimeout(timer);
      es?.close();
      window.removeEventListener('online', onOnline);
    };
  }, [room]);

  return { votes, status };
}
