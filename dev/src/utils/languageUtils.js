// Функция для переключения языка
export const toggleLanguage = (currentLanguage) => {
  return currentLanguage === "ru" ? "en" : "ru";
};

// Функция для получения текста на основе языка
export const getLocalizedText = (textKey, language) => {
  const translations = {
    weatherForecast: {
      ru: "Прогноз на неделю",
      en: "Forecast for the week",
    },
    getWeather: {
      ru: "Найти погоду",
      en: "Get Weather",
    },
    hoverMyLocation: {
      ru: "GPS",
      en: "GPS",
    },
    enterCity: {
      ru: "Название города",
      en: "City name",
    },
    enterData: {
      ru: "Введите данные",
      en: "Enter data",
    },
    hoverCity: {
      ru: "Город",
      en: "City",
    },
    enterLatitude: {
      ru: "Широта",
      en: "Latitude",
    },
    enterLongitude: {
      ru: "Долгота",
      en: "Longitude",
    },
    currentWeatherIn: {
      ru: "Текущая погода в",
      en: "Current weather in",
    },
    temperature: {
      ru: "Температура",
      en: "Temperature",
    },
    weatherDescription: {
      ru: "Погода",
      en: "Weather",
    },
    pressure: {
      ru: "Давление",
      en: "Pressure",
    },
    pressureUnit: {
      ru: "гПа",
      en: "hPa",
    },
    humidity: {
      ru: "Влажность",
      en: "Humidity",
    },
    windSpeedUnit: {
      ru: "км/ч",
      en: "km/h",
    },
    windSpeed: {
      ru: "Скорость ветра",
      en: "Wind Speed",
    },
    sunrise: {
      ru: "Восход",
      en: "Sunrise",
    },
    sunset: {
      ru: "Закат",
      en: "Sunset",
    },
    "5days": {
      ru: "5 дней",
      en: "5 days",
    },
    "7days": {
      ru: "7 дней",
      en: "7 days",
    },
    "14days": {
      ru: "14 дней",
      en: "14 days",
    },
    errorData: {
      ru: "Ошибка при получении данных:",
      en: "Error while receiving data:",
    },
    repeatRequest: {
      ru: "Запрос с такими же параметрами уже выполнен, повторного запроса не требуется.",
      en: "A request with the same parameters has already been completed; a repeat request is not required.",
    },
    noData14days: {
      ru: "Нет данных на 14 дней",
      en: "No data for 14 days",
    },
  };

  return translations[textKey][language];
};
