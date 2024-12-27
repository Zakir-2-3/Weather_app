import { getWeatherImage } from "../../../utils/weatherImageUtils";
import "./HourlyWeatherContainer.scss";

function HourlyWeatherContainer({
  hourlyData = [],
  onForecastSelect,
  activeIndex,
  setActiveIndex,
}) {
  return (
    <div className="hourly-weather__container">
      <ul className="hourly-weather__list">
        {Array.from({ length: 8 }, (_, index) => {
          const entry = hourlyData[index];
          const weatherIcon =
            entry && entry.weather
              ? getWeatherImage(entry) // Проверяем по времени суток
              : getWeatherImage(null); // Отображаем иконку по умолчанию, если данных нет
          return (
            <li
              className={`hourly-weather__item ${
                activeIndex === index ? "list-active" : ""
              }`}
              key={index}
              onClick={() => {
                if (entry) {
                  onForecastSelect(entry); // Передаем данные в CurrentForecastContainer
                  setActiveIndex(index); // Устанавливаем новый активный элемент
                }
              }}
            >
              <p>{entry ? entry.time : "—:—"}</p>
              <hr />
              <img src={weatherIcon} alt="Weather-icon" />
              <p>{entry ? `${entry.temp}°` : "—"}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HourlyWeatherContainer;
