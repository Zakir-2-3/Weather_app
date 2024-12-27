// Для иконок погоды
import clearDayIcon from "@assets/icons/weather-icons/clear-day.svg";
import clearNightIcon from "@assets/icons/weather-icons/clear-night.svg";
import rainIcon from "@assets/icons/weather-icons/rain.svg";
import snowIcon from "@assets/icons/weather-icons/snow.svg";
import mistIcon from "@assets/icons/weather-icons/mist.svg";
import windIcon from "@assets/icons/weather-icons/wind.svg";
import cloudyIcon from "@assets/icons/weather-icons/cloudy.svg";
import defaultIcon from "@assets/icons/weather-icons/default.svg";

// Для заднего фона погоды
import clearDayBg from "@assets/images/clear-day-bg-img.jpg";
import clearNightBg from "@assets/images/clear-night-bg-img.jpg";
import cloudyDayBg from "@assets/images/cloudy-day-bg-img.jpg";
import cloudyNightBg from "@assets/images/cloudy-night-bg-img.jpg";
import rainDayBg from "@assets/images/rain-day-bg-img.jpg";
import rainNightBg from "@assets/images/rain-night-bg-img.jpg";
import snowDayBg from "@assets/images/snow-day-bg-img.jpeg";
import snowNightBg from "@assets/images/snow-night-bg-img.jpg";

const weatherGroupMap = {
  ClearDay: clearDayIcon, // Солнечный день
  ClearNight: clearNightIcon, // Теплая ночь
  Rain: rainIcon, // Дождь
  Drizzle: rainIcon, // Мелкий дождь
  Thunderstorm: rainIcon, // Гроза
  Snow: snowIcon, // Снег
  Mist: mistIcon, // Туман
  Smoke: mistIcon, // Дым
  Haze: mistIcon, // Легкая дымка
  Dust: mistIcon, // Пыль
  Fog: mistIcon, // Туман
  Sand: mistIcon, // Песчаная буря
  Ash: mistIcon, // Пепел
  Squall: windIcon, // Шквалистый ветер
  Tornado: windIcon, // Торнадо
  Clouds: cloudyIcon, // Облака
  Default: defaultIcon, // Изображение по умолчанию
};

export const getWeatherImage = (weatherData) => {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
    return defaultIcon; // Изображение по умолчанию
  }

  // Получаем время для прогноза или текущее время
  const weatherMain = weatherData.weather[0].main;
  const forecastTime = weatherData.dt
    ? new Date(weatherData.dt * 1000).getHours()
    : new Date().getHours();

  // Если погода "Clear", выбираем иконку дня или ночи
  if (weatherMain === "Clear") {
    return forecastTime >= 6 && forecastTime < 18
      ? weatherGroupMap["ClearDay"] // Дневная ясная погода
      : weatherGroupMap["ClearNight"]; // Ночная ясная погода
  }

  if (!weatherGroupMap[weatherMain]) {
    console.warn(`Unknown weather type: ${weatherMain}`);
  }

  return weatherGroupMap[weatherMain] || defaultIcon;
};

export const getWeatherBackground = (weatherData) => {
  if (
    !weatherData ||
    !weatherData.weather ||
    weatherData.weather.length === 0
  ) {
    const currentTime = new Date().getHours();
    return currentTime >= 6 && currentTime < 18
      ? cloudyDayBg // Дневной фон по умолчанию
      : cloudyNightBg; // Ночной фон по умолчанию
  }

  const currentTime = new Date().getHours();
  const isDayTime = currentTime >= 6 && currentTime < 18;

  // Приоритет типов погоды
  const priorityOrder = [
    "Snow",
    "Rain",
    "Drizzle",
    "Thunderstorm",
    "Mist",
    "Clouds",
    "Clear",
  ];

  // Определяем главный тип погоды с наивысшим приоритетом
  const mainCondition = weatherData.weather
    .map((entry) => entry.main) // Берем только "main" из массива
    .sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b))[0]; // Сортируем и берем первый

  // Логика выбора фона
  if (mainCondition === "Snow") {
    return isDayTime ? snowDayBg : snowNightBg;
  }
  if (
    mainCondition === "Rain" ||
    mainCondition === "Drizzle" ||
    mainCondition === "Thunderstorm"
  ) {
    return isDayTime ? rainDayBg : rainNightBg;
  }
  if (mainCondition === "Mist") {
    return isDayTime ? rainDayBg : rainNightBg;
  }
  if (mainCondition === "Clear") {
    return isDayTime ? clearDayBg : clearNightBg;
  }
  if (mainCondition === "Clouds") {
    return isDayTime ? cloudyDayBg : cloudyNightBg;
  }

  // Фон по умолчанию
  return isDayTime ? cloudyDayBg : cloudyNightBg;
};
