// Только буквы, точки и тире для названия города
export const sanitizeCityInput = (input, setLatitude, setLongitude) => {
  setLatitude(""); // Очищает координаты
  setLongitude("");
  return input
    .replace(/[^a-zA-Zа-яА-ЯёЁ.\s-]/g, "") // Разрешаем буквы, точки, дефисы и пробелы
    .replace(/\s+/g, " "); // Заменяем несколько пробелов одним
};

// Только цифры и одну точку для координат
export const sanitizeCoordinateInput = (input, setCity) => {
  setCity(""); // Очищает название города
  let sanitizedInput = input.replace(/[^0-9.]/g, ""); // Удаляем все, кроме цифр и точки
  const dotIndex = sanitizedInput.indexOf(".");

  // Удаляем все точки, кроме первой
  if (dotIndex !== -1) {
    sanitizedInput =
      sanitizedInput.slice(0, dotIndex + 1) +
      sanitizedInput.slice(dotIndex + 1).replace(/\./g, "");
  }

  return sanitizedInput;
};
