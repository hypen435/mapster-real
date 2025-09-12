import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-column">
          <h4>{t('product')}</h4>
          <a href="/">{t('home')}</a>
          <a href="/live-map">{t('status')}</a>
          <a href="/issues">{t('viewIssues')}</a>
        </div>
        <div className="footer-column">
          <h4>{t('company')}</h4>
          <a href="/about">{t('about')}</a>
          <a href="/contact">{t('contact')}</a>
          <a href="/issues">{t('viewIssues')}</a>
          <a href="/report">{t('reportIssues')}</a>
        </div>
        <div className="footer-column">
          <h4>{t('resources')}</h4>
          <a href="#">{t('college')}</a>
          <a href="#">{t('support')}</a>
          <a href="#">{t('safety')}</a>
          <a href="#">{t('blog')}</a>
        </div>
        <div className="footer-column">
          <h4>{t('policies')}</h4>
          <a href="#">{t('terms')}</a>
          <a href="#">{t('privacy')}</a>
          <a href="#">{t('cookieSettings')}</a>
          <a href="#">{t('guidelines')}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">MAPSTER</div>
        <a className="btn btn-primary" href="/signup">{t('signUp')}</a>
        <div className="language-selector">
          <label htmlFor="language">{t('language')}:</label>
          <select id="language" onChange={(e) => changeLanguage(e.target.value)} aria-label={t('language')}>
            <option value="en">English</option>
            <option value="pa">Punjabi</option>
            <option value="ta">Tamil</option>
            <option value="gu">Gujarati</option>
            <option value="mr">Marathi</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </footer>
  );
}


