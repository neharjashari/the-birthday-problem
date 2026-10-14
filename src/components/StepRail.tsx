import type { CSSProperties } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useI18n } from '../i18n';
import { STEPS } from '../steps';

const IDS = STEPS.map((s) => s.id);

/**
 * Vertical table of contents pinned to the left on wide screens. The line between
 * the dots fills up to the current step; it stays hidden while the hero is on screen.
 */
export function StepRail() {
  const { t } = useI18n();
  const { active } = useScrollSpy(IDS);
  const current = active ? IDS.indexOf(active) : -1;
  const fill = current < 0 ? 0 : current / (STEPS.length - 1);

  return (
    <nav className={`step-rail${current < 0 ? ' idle' : ''}`} aria-label={t('footer.steps')}>
      <div className="rail-line" aria-hidden="true">
        <span style={{ '--fill': fill } as CSSProperties} />
      </div>
      <ol>
        {STEPS.map(({ id, nav }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={i < current ? 'done' : undefined}
              aria-current={i === current ? 'step' : undefined}
            >
              <span className="rail-dot">{i + 1}</span>
              <span className="rail-text">
                <span className="rail-label">{t(nav)}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
