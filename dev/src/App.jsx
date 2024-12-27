import { useEffect, useState } from "react";

import Header from "./components/header/Header";
import CurrentWeatherDate from "./components/current-weather-components/current-weather-date/CurrentWeatherDate";
import CurrentWeatherDescription from "./components/current-weather-components/current-weather-description/CurrentWeatherDescription";
import HourlyWeatherContainer from "./components/current-weather-components/hourly-weather-container/HourlyWeatherContainer";
import SearchForecastContainer from "./components/weekly-weather-forecast-components/search-forecast-container/SearchForecastContainer";
import CurrentForecastContainer from "./components/weekly-weather-forecast-components/current-forecast-container/CurrentForecastContainer";
import NextDaysForecastContainer from "./components/weekly-weather-forecast-components/next-days-forecast-container/NextDaysForecastContainer";

import {
  getCityId,
  getCurrentWeather,
  getForecastWeather,
} from "./api/weatherApi";
import { getWeatherBackground } from "./utils/weatherImageUtils";
import { toggleLanguage, getLocalizedText } from "./utils/languageUtils";

import defaultBgImg from "@assets/images/cloudy-day-bg-img.jpg"; // Фон по умолчанию

import "./styles/App.scss";

function App() {
  const [language, setLanguage] = useState("ru"); // начальный язык - русский
  const [weatherData, setWeatherData] = useState(null); // данные о погоде
  const [forecastData, setForecastData] = useState([]); // данные о прогнозе
  const [daysToShow, setDaysToShow] = useState(5); // количество дней для отображения
  const [noDataMessage, setNoDataMessage] = useState(""); // сообщение об отсутствии данных
  const [searchParams, setSearchParams] = useState(null); // параметры поиска
  const [lastSearchParams, setLastSearchParams] = useState(null); // параметры последнего поиска
  const [isInitialLoad, setIsInitialLoad] = useState(true); // флаг для отслеживания первого запуска
  const [isFetching, setIsFetching] = useState(false); // флаг для отслеживания состояния запроса
  const [hourlyData, setHourlyData] = useState([]); // Данные по часам
  const [selectedForecast, setSelectedForecast] = useState(null); // Состояние для выбранного прогноза
  const [activeIndex, setActiveIndex] = useState(0); // Состояние для активного элемента прогноза
  const [backgroundImage, setBackgroundImage] = useState(defaultBgImg); // Фон для сайта
  const [todayData, setTodayData] = useState([]); // Сохраняем данные текущего дня

  let currentController; // контроллер текущей погоды

  // Переключение языка с повторным запросом данных
  const handleLanguageToggle = () => {
    if (isFetching) return; // Если запрос уже выполняется, блокируем кнопку

    const newLanguage = toggleLanguage(language);
    setLanguage(newLanguage);
    setIsFetching(true); // Устанавливаем флаг запроса в true

    // Если есть выбранный прогноз, обновляем описание
    if (selectedForecast) {
      const updatedForecast = {
        ...selectedForecast,
        description: selectedForecast.description,
      };
      setSelectedForecast(updatedForecast);
    }

    // Обновляем noDataMessage при смене языка, если выбрано "14 дней"
    if (daysToShow === 14) {
      setNoDataMessage(getLocalizedText("noData14days", newLanguage));
    }

    // Если есть параметры поиска, выполняем запрос
    if (searchParams) {
      fetchWeatherData(searchParams, newLanguage).finally(() => {
        setIsFetching(false); // Завершаем запрос, восстанавливаем возможность переключения языка
      });
    } else {
      setIsFetching(false); // Если нет параметров поиска, сразу завершаем запрос
    }
  };

  const fetchWeatherData = async (params, lang) => {
    // Проверка входных данных
    if (!params || (!params.city && !params.latitude && !params.longitude)) {
      alert(getLocalizedText("enterData", language));
      return;
    }

    if (
      JSON.stringify(params) === JSON.stringify(lastSearchParams) &&
      language === lang
    ) {
      console.log(getLocalizedText("repeatRequest", language));
      return;
    }

    setLastSearchParams(params);
    setSearchParams(params);
    setIsInitialLoad(false);

    if (currentController) {
      currentController.abort();
    }

    currentController = new AbortController();
    const signal = currentController.signal;

    try {
      let cityId = params.city ? await getCityId(params.city, signal) : null;
      const weatherParams = { ...params, cityId };

      const weatherJson = await getCurrentWeather(weatherParams, lang, signal);
      setWeatherData(weatherJson);

      const background = getWeatherBackground(weatherJson);
      setBackgroundImage(background);

      const forecastJson = await getForecastWeather(
        weatherParams,
        lang,
        signal
      );

      if (forecastJson && forecastJson.length > 0) {
        setForecastData(forecastJson);

        const todayDate = new Date().toLocaleDateString();
        const todayEntries = forecastJson.filter((entry) => {
          const entryDate = new Date(entry.dt * 1000).toLocaleDateString();
          return entryDate === todayDate;
        });

        let combinedEntries = [...todayEntries];
        if (todayEntries.length < 8) {
          const nextDayDate = new Date();
          nextDayDate.setDate(nextDayDate.getDate() + 1);
          const nextDayString = nextDayDate.toLocaleDateString();

          const nextDayEntries = forecastJson.filter((entry) => {
            const entryDate = new Date(entry.dt * 1000).toLocaleDateString();
            return entryDate === nextDayString;
          });

          combinedEntries = [...todayEntries, ...nextDayEntries].slice(0, 8);
        }

        setTodayData(combinedEntries);

        const hourlyData = combinedEntries.map((entry) => ({
          time: new Date(entry.dt * 1000).toLocaleTimeString(lang, {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: Math.round(entry.main.temp),
          pressure: entry.main.pressure,
          humidity: entry.main.humidity,
          windSpeed: Math.round(entry.wind.speed * 3.6),
          description: entry.weather[0]?.description || "No description",
          icon: entry.weather[0]?.icon || "default",
          weather: entry.weather, // Добавляем массив weather для getWeatherImage
          dt: entry.dt, // Добавляем временную метку
          sunrise: weatherJson.sys?.sunrise
            ? new Date(weatherJson.sys.sunrise * 1000).toLocaleTimeString(
                lang,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : "-",
          sunset: weatherJson.sys?.sunset
            ? new Date(weatherJson.sys.sunset * 1000).toLocaleTimeString(lang, {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
        }));

        setHourlyData(hourlyData);

        // Сбрасываем активный индекс и обновляем выбранный прогноз
        setSelectedForecast(hourlyData[0]);
        setActiveIndex(0); // Добавлено обратно
      } else {
        console.warn("No hourly data available in forecastData.list");
        setForecastData([]);
        setHourlyData([]);
        setSelectedForecast(null);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(getLocalizedText("errorData", language), error);
        alert(getLocalizedText("errorData", language), error.message);
      }
    }
  };

  // Кнопка 14 дней
  const handleDaysToShowChange = (days) => {
    setDaysToShow(days);
    setNoDataMessage(
      days === 14 ? getLocalizedText("noData14days", language) : ""
    );
  };

  const handleDaySelect = (dayData, isToday = false) => {
    let filteredData;

    if (isToday) {
      if (!todayData || todayData.length === 0) {
        console.warn("No saved data for today!");
        setHourlyData([]);
        setSelectedForecast(null);
        setActiveIndex(0); // Сбрасываем индекс
        return;
      }

      filteredData = [...todayData];
    } else {
      filteredData = dayData.filter((entry) => {
        const hour = new Date(entry.dt * 1000).getHours();
        return hour >= 0;
      });
    }

    const formattedData = filteredData.map((entry) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString(language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(entry.main.temp),
      pressure: entry.main.pressure,
      humidity: entry.main.humidity,
      windSpeed: Math.round(entry.wind.speed * 3.6),
      description: entry.weather[0]?.description || "No description",
      icon: entry.weather[0]?.icon || "default",
      weather: entry.weather,
      dt: entry.dt, // Временная метка
      sunrise: weatherData?.sys?.sunrise
        ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
            language,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : "-",
      sunset: weatherData?.sys?.sunset
        ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(language, {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
    }));

    setHourlyData(formattedData.slice(0, 8));
    setSelectedForecast(formattedData[0]);
    setActiveIndex(0); // Сбрасываем индекс активного элемента
  };

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    } else {
      console.warn("No background image set.");
    }
  }, [backgroundImage]);

  return (
    <>
      <Header language={language} toggleLanguage={handleLanguageToggle} />
      <main className="main">
        <div className="main-container">
          <div className="current-weather__container">
            <CurrentWeatherDate language={language} />
            <CurrentWeatherDescription
              description={selectedForecast?.description || ""}
            />
            <HourlyWeatherContainer
              hourlyData={hourlyData}
              onForecastSelect={setSelectedForecast}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
          <div className="weekly-forecast__container">
            <SearchForecastContainer
              onSearch={(params) => fetchWeatherData(params, language)}
              language={language}
            />
            <CurrentForecastContainer
              forecastData={
                selectedForecast || {
                  temp: "-",
                  pressure: "-",
                  humidity: "-",
                  windSpeed: "-",
                  sunrise: "-",
                  sunset: "-",
                  description: "-",
                }
              }
              language={language}
            />
            <NextDaysForecastContainer
              forecastData={forecastData}
              daysToShow={daysToShow}
              setDaysToShow={handleDaysToShowChange}
              noDataMessage={noDataMessage}
              currentTemp={weatherData?.main.temp}
              language={language}
              isInitialLoad={isInitialLoad}
              onDaySelect={handleDaySelect}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
