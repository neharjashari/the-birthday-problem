import { useState } from 'react';
import { T } from '../components/Text';
import { CheckIcon, CrossIcon, Section } from '../components/ui';
import { useI18n, type MessageKey } from '../i18n';
import { STEPS } from '../steps';

/** The professor's questions, each answered in one card with links to the steps that show it. */
const ANSWERS: Array<{ q: MessageKey; a: MessageKey; steps: string[] }> = [
  { q: 'sum.q.calc', a: 'sum.a.calc', steps: ['paradox', 'any-n', 'hash-lab'] },
  { q: 'sum.q.logic', a: 'sum.a.logic', steps: ['paradox', 'any-n'] },
  { q: 'sum.q.hash', a: 'sum.a.hash', steps: ['why', 'hash'] },
  { q: 'sum.q.security', a: 'sum.a.security', steps: ['hash-lab', 'yuval', 'practice'] },
];

const QUIZ: Array<{ q: MessageKey; options: MessageKey[]; correct: number; why: MessageKey }> = [
  { q: 'quiz.1.q', options: ['quiz.1.a', 'quiz.1.b', 'quiz.1.c'], correct: 1, why: 'quiz.1.why' },
  { q: 'quiz.2.q', options: ['quiz.2.a', 'quiz.2.b', 'quiz.2.c'], correct: 0, why: 'quiz.2.why' },
  { q: 'quiz.3.q', options: ['quiz.3.a', 'quiz.3.b', 'quiz.3.c'], correct: 2, why: 'quiz.3.why' },
];

export function S8Summary() {
  const { t } = useI18n();
  return (
    <Section id="summary" title="sum.title">
      <div className="answers">
        {ANSWERS.map((x) => (
          <div key={x.q} className="card answer">
            <h3>{t(x.q)}</h3>
            <p style={{ margin: 0 }}>
              <T k={x.a} />
            </p>
            <div className="answer-links">
              {x.steps.map((id) => {
                const n = STEPS.findIndex((s) => s.id === id) + 1;
                return (
                  <a key={id} href={`#${id}`} className="chip">
                    {t('ui.step', { n })}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <h3>{t('quiz.title')}</h3>
      <div className="quiz">
        {QUIZ.map((item, i) => (
          <Question key={item.q} n={i + 1} {...item} />
        ))}
      </div>
    </Section>
  );
}

function Question({ n, q, options, correct, why }: { n: number; q: MessageKey; options: MessageKey[]; correct: number; why: MessageKey }) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  return (
    <div className="card stack">
      <p style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>
        {n}. <T k={q} />
      </p>
      <div className="quiz-options">
        {options.map((o, i) => {
          const state = !done ? '' : i === correct ? 'right' : i === picked ? 'wrong' : 'dim';
          return (
            <button key={o} className={`quiz-option ${state}`} disabled={done} onClick={() => setPicked(i)}>
              {done && i === correct && <CheckIcon />}
              {done && i === picked && i !== correct && <CrossIcon />}
              <span>
                <T k={o} />
              </span>
            </button>
          );
        })}
      </div>
      {done && (
        <p className="small" style={{ margin: 0 }} aria-live="polite">
          <strong>{picked === correct ? t('quiz.right') : t('quiz.wrong')}</strong> <T k={why} />{' '}
          <button className="linklike" onClick={() => setPicked(null)}>
            {t('quiz.retry')}
          </button>
        </p>
      )}
    </div>
  );
}
