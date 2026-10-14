import { useI18n } from '../i18n';
import { STEPS } from '../steps';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useTheme } from './theme';

const IDS = STEPS.map((s) => s.id);

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const { progress, active } = useScrollSpy(IDS);
  const activeIndex = active ? IDS.indexOf(active) : -1;
  return (
    <header className="header">
      <div className="container wide header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            23
          </span>
          <span className="brand-name">{t('app.title')}</span>
        </a>
        <nav className="nav" aria-label="Sections">
          {STEPS.map(({ id, nav }, i) => (
            <a
              key={id}
              href={`#${id}`}
              title={t(nav)}
              className={i < activeIndex ? 'done' : undefined}
              aria-current={active === id ? 'step' : undefined}
            >
              <span className="num">{i + 1}</span>
              <span className="nav-label">{t(nav)}</span>
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <a className="live-pill" href="#live" title={t('app.live')}>
            <span className="live-dot" aria-hidden="true" />
            <span className="live-pill-label">{t('nav.live')}</span>
          </a>
          <div className="segmented" role="group" aria-label={t('ui.language')}>
            <button aria-pressed={lang === 'sq'} onClick={() => setLang('sq')} lang="sq">
              SQ
            </button>
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">
              EN
            </button>
          </div>
          <button className="icon-btn" onClick={toggle} aria-label={t('ui.theme')} title={t('ui.theme')}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  );
}

export const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);
