export const capitalizeFirstLetter = (text) => {
  if (!text) return ""; // Проверяем, если текст пустой
  return text.charAt(0).toUpperCase() + text.slice(1);
};
