import { AUTHORS, REFERENCES, REPO_URL } from '../config';
import { useI18n } from '../i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container wide footer-grid">
        <div className="footer-about">
          <a className="brand" href="#top">
            <span className="brand-name">{t('app.title')}</span>
          </a>
          <p className="small">{t('footer.course')}</p>
          <p className="small">
            {t('footer.authors')}: <strong>{AUTHORS.join(', ')}</strong>
          </p>
          <p className="small">
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              {t('footer.source')} ↗
            </a>
          </p>
        </div>

        <div>
          <h3>{t('footer.refs')}</h3>
          <ul className="footer-refs">
            {REFERENCES.map((r) => (
              <li key={r.label}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.label}
                  </a>
                ) : (
                  r.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container wide footer-bottom small">{t('footer.ai')}</div>
    </footer>
  );
}
