const apiKey = "7aecdc9518916988845e1e9a64cc079e";

// Функция для получения ID города по названию
export const getCityId = async (city, signal) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl, { signal });
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  const data = await response.json();
  return data.id;
};

// Функция для получения текущей погоды
export const getCurrentWeather = async (params, lang, signal) => {
  const { latitude, longitude, cityId } = params;
  let apiUrl;

  if (latitude && longitude) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=${lang}`;
  } else if (cityId) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric&lang=${lang}`;
  } else {
    throw new Error("Необходимо передать параметры для запроса");
  }

  const response = await fetch(apiUrl, { signal });
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  return await response.json();
};

// Функция для получения недельной погоды
export const getForecastWeather = async (params, lang, signal) => {
  const { latitude, longitude, cityId } = params;
  let apiUrl;

  if (latitude && longitude) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=${lang}`;
  } else if (cityId) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric&lang=${lang}`;
  } else {
    throw new Error("Необходимо передать параметры для запроса");
  }

  const response = await fetch(apiUrl, { signal });
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  const data = await response.json();

  // Проверка наличия списка прогнозов
  if (!data.list || data.list.length === 0) {
    console.warn("Прогноз отсутствует или пустой:", data);
    return [];
  }

  return data.list; // Возвращаем массив прогнозов
};
