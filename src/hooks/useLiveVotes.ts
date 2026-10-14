import { useEffect, useState } from 'react';
import { NTFY_BASE, decodeVote, encodeVote, topicFor } from '../lib/live';

export type LinkStatus = 'connecting' | 'live' | 'error';

/**
 * Subscribes to a room's ntfy topic (Server-Sent Events). `since=all` replays the
 * messages ntfy keeps cached (about 12 h), so a reloaded projector loses nothing.
 */
export function useLiveVotes(room: string) {
  const [votes, setVotes] = useState<Array<{ voter: string; day: number }>>([]);
  const [status, setStatus] = useState<LinkStatus>('connecting');

  useEffect(() => {
    setVotes([]);
    setStatus('connecting');
    const seen = new Set<string>();
    const es = new EventSource(`${NTFY_BASE}/${topicFor(room)}/sse?since=all`);
    es.onopen = () => setStatus('live');
    es.onerror = () => setStatus(es.readyState === EventSource.CLOSED ? 'error' : 'connecting');
    es.onmessage = (e: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(e.data) as { id?: string; event?: string; message?: string };
        if (msg.event !== 'message' || !msg.id || seen.has(msg.id)) return;
        seen.add(msg.id);
        const vote = decodeVote(msg.message ?? '');
        if (vote) setVotes((v) => [...v, vote]);
      } catch {
        /* ignore malformed events */
      }
    };
    return () => es.close();
  }, [room]);

  return { votes, status };
}

export async function sendVote(room: string, voter: string, day: number): Promise<void> {
  const res = await fetch(`${NTFY_BASE}/${topicFor(room)}`, { method: 'POST', body: encodeVote(voter, day) });
  if (!res.ok) throw new Error(`ntfy ${res.status}`);
}
