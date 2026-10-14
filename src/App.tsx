import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroVisual } from './components/HeroVisual';
import { StepRail } from './components/StepRail';
import { T } from './components/Text';
import { useReveal } from './hooks/useReveal';
import { useI18n } from './i18n';
import { S1Paradox } from './sections/S1Paradox';
import { S2General } from './sections/S2General';
import { S3HashLab } from './sections/S3HashLab';
import { S4RealWorld } from './sections/S4RealWorld';
import { S5Yuval } from './sections/S5Yuval';
import { S0Hash } from './sections/S0Hash';
import { S0Why } from './sections/S0Why';
import { S8Summary } from './sections/S8Summary';
import { LivePage } from './live/LivePage';
import { VotePage } from './live/VotePage';
import { isValidRoom, newRoomCode } from './lib/live';

type Route = { page: 'app' } | { page: 'live' | 'vote'; room: string };

/** "#live/<room>" (projector) and "#vote/<room>" (phones); every other hash is the normal app. */
function parseRoute(hash: string): Route {
  const m = /^#(live|vote)(?:\/([a-z0-9]+))?$/.exec(hash);
  if (!m) return { page: 'app' };
  const page = m[1] as 'live' | 'vote';
  if (m[2] && isValidRoom(m[2])) return { page, room: m[2] };
  return page === 'live' ? { page, room: '' } : { page: 'app' };
}

function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  useEffect(() => {
    // "#live" without a room: open a fresh one
    if (route.page === 'live' && !route.room) location.replace(`#live/${newRoomCode()}`);
  }, [route]);
  return route;
}

export default function App() {
  const route = useRoute();
  if (route.page === 'vote') return <VotePage room={route.room} />;
  if (route.page === 'live') return route.room ? <LivePage room={route.room} /> : null;
  return <Website />;
}

function Website() {
  const { t } = useI18n();
  useReveal();
  return (
    <>
      <Header />
      <StepRail />
      <main id="top">
        <div className="hero">
          <div className="container wide hero-inner">
            <div className="hero-text">
              <h1>{t('app.title')}</h1>
              <p className="subtitle">{t('app.subtitle')}</p>
              <p className="lead">
                <T k="app.lead" />
              </p>
              <div className="btn-row">
                <a className="btn" href="#why">
                  {t('app.start')}
                </a>
                <a className="btn live-btn" href="#live">
                  <span className="live-dot" aria-hidden="true" />
                  {t('app.live')}
                </a>
              </div>
            </div>
            <HeroVisual />
          </div>
        </div>
        {/* order and numbering come from src/steps.ts */}
        <S0Why />
        <S0Hash />
        <S1Paradox />
        <S2General />
        <S3HashLab />
        <S5Yuval />
        <S4RealWorld />
        <S8Summary />
      </main>
      <Footer />
    </>
  );
}
