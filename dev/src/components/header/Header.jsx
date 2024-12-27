import "./Header.scss";

const Header = ({ language, toggleLanguage, weatherData }) => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">
          {language === "ru" ? "Прогноз погоды" : "Weather Forecast"}
        </h1>
        <div className="header__settings">
          <div className="header__language">
            <button
              className={`language-toggle ${language}`}
              onClick={toggleLanguage}
            ></button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
