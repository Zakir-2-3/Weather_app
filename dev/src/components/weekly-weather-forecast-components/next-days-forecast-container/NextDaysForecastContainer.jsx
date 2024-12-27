import { useRef, useState } from "react";

import { getWeatherImage } from "../../../utils/weatherImageUtils";
import { getLocalizedText } from "../../../utils/languageUtils";
import { capitalizeFirstLetter } from "../../../helpers/capitalize";

import scrollArrow from "../../../assets/icons/other-icons/scroll-arrow.svg";

import "./NextDaysForecastContainer.scss";

const NextDaysForecastContainer = ({
  forecastData,
  daysToShow,
  setDaysToShow,
  noDataMessage,
  currentTemp,
  language,
  isInitialLoad,
  onDaySelect,
}) => {
  const dailyForecasts = {}; // Группируем прогнозы по дням
  const noMessageText = "¯\\_(ツ)_/¯"; // Смайлик на 14 дней

  const [activeIndex, setActiveIndex] = useState(0); // Первый элемент активен по умолчанию
  const scrollContentRef = useRef(null); // Реф для списка
  const scrollIntervalRef = useRef(null); // Реф для интервала

  // Функция для запуска прокрутки
  const startScroll = (direction) => {
    const scrollStep = direction === "up" ? -5 : 5; // Направление прокрутки
    stopScroll(); // Остановить текущий интервал, если он есть
    scrollIntervalRef.current = setInterval(() => {
      if (scrollContentRef.current) {
        scrollContentRef.current.scrollTop += scrollStep; // Прокрутка
      }
    }, 50); // Интервал обновления
  };

  // Функция для остановки прокрутки
  const stopScroll = () => {
    clearInterval(scrollIntervalRef.current);
  };

  // Группируем прогнозы по дням
  forecastData.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString(
      language === "ru" ? "ru-RU" : "en-US"
    );
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(forecast);
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { month: "long", day: "numeric" };

    let formattedDate = new Intl.DateTimeFormat(
      language === "ru" ? "ru-RU" : "en-US",
      options
    ).format(date);

    let [day, month] = formattedDate.split(" ");
    if (language === "en") {
      [month, day] = [day, month];
    }

    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${capitalizedMonth}`;
  };

  const filteredData = Object.keys(dailyForecasts)
    .slice(0, daysToShow)
    .map((date) => {
      const dayData = dailyForecasts[date];
      const morningTemp =
        Math.floor(
          dayData.find((entry) => new Date(entry.dt * 1000).getHours() === 6)
            ?.main.temp || currentTemp
        ) || "?";
      const nightTemp =
        Math.floor(
          dayData.find((entry) => new Date(entry.dt * 1000).getHours() === 21)
            ?.main.temp || ""
        ) || "?";
      const description = capitalizeFirstLetter(
        dayData[0].weather[0].description
      );
      const formattedDate = formatDate(dayData[0].dt);

      // Упрощение для Clear (всегда показывать дневную иконку)
      const dayWeatherData = { ...dayData[0] };
      if (dayWeatherData.weather[0].main === "Clear") {
        dayWeatherData.weather[0].main = "ClearDay";
      }
      const weatherIcon = getWeatherImage(dayData[0]);

      return {
        date: formattedDate,
        morningTemp,
        nightTemp,
        description,
        icon: weatherIcon,
        data: dayData,
      };
    });

  return (
    <div className="forecast-next-days__container">
      <p>{getLocalizedText("weatherForecast", language)}</p>
      <div className="forecast-next-weeks__container">
        <button
          onClick={() => {
            setDaysToShow(5);
            setActiveIndex(0); // Сбрасываем активный элемент на первый
            if (filteredData.length > 0) {
              onDaySelect(filteredData[0].data, true); // Передаём данные первого дня
            }
          }}
          className={`forecast-next-weeks__btn ${
            daysToShow === 5 ? "forecast-next-weeks__btn--active" : ""
          }`}
        >
          {getLocalizedText("5days", language)}
        </button>
        <span></span>
        <button
          onClick={() => {
            setDaysToShow(7);
            setActiveIndex(0); // Сбрасываем активный элемент на первый
            if (filteredData.length > 0) {
              onDaySelect(filteredData[0].data, true); // Передаём данные первого дня
            }
          }}
          className={`forecast-next-weeks__btn ${
            daysToShow === 7 ? "forecast-next-weeks__btn--active" : ""
          }`}
        >
          {getLocalizedText("7days", language)}
        </button>
        <span></span>
        <button
          onClick={() => {
            setDaysToShow(14);
            setActiveIndex(0); // Сбрасываем активный элемент на первый
            if (filteredData.length > 0) {
              onDaySelect(filteredData[0].data, true); // Передаём данные первого дня
            }
          }}
          className={`forecast-next-weeks__btn ${
            daysToShow === 14 ? "forecast-next-weeks__btn--active" : ""
          }`}
        >
          {getLocalizedText("14days", language)}
        </button>
      </div>

      <div className="forecast-next-days-info__container">
        {/* Стрелки только для 7 дней */}
        {daysToShow === 7 && noDataMessage === "" && (
          <div
            className="arrow arrow-up"
            onMouseEnter={() => startScroll("up")}
            onMouseLeave={stopScroll}
          >
            <img src={scrollArrow} alt="arrow-up" />
          </div>
        )}
        {noDataMessage ? (
          <div className="forecast-next-days__no-data">
            <p>{noDataMessage}</p> <p>{noMessageText}</p>
          </div>
        ) : isInitialLoad ? (
          <div className="forecast-next-days__no-current-data">
            <p>{getLocalizedText("enterData", language)}</p>
            <p>{noMessageText}</p>
          </div>
        ) : (
          <ul
            className={`forecast-next-days__list ${
              daysToShow === 7 ? "scrollable" : ""
            }`}
            ref={scrollContentRef}
          >
            {filteredData.map((forecast, index) => (
              <li
                key={index}
                className={`forecast-next-days__list-item ${
                  activeIndex === index ? "list-active" : ""
                }`}
                onClick={() => {
                  setActiveIndex(index); // Устанавливаем активный элемент
                  onDaySelect(forecast.data, index === 0); // Если это первый день, передаём isToday = true
                }}
              >
                <div className="forecast-next-days__weather-image">
                  <img src={forecast.icon} alt="weather-icon" />
                </div>
                <div className="forecast-next-days__weather-description">
                  <p>{forecast.date}</p>
                  <p>{forecast.description}</p>
                </div>
                <div className="forecast-next-days__weather-temperature">
                  <p>{forecast.morningTemp}°</p>
                  <p>{forecast.nightTemp}°</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Стрелки только для 7 дней */}
        {daysToShow === 7 && noDataMessage === "" && (
          <div
            className="arrow arrow-down"
            onMouseEnter={() => startScroll("down")}
            onMouseLeave={stopScroll}
          >
            <img src={scrollArrow} alt="arrow-down" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NextDaysForecastContainer;
