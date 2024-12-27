import "./CurrentWeatherDate.scss";

const CurrentWeatherDate = ({ language }) => {
  const currentDate = new Date();

  // Форматируем дату с учетом языка
  const options = { month: "long", day: "numeric" };
  let formattedDate = new Intl.DateTimeFormat(
    language === "ru" ? "ru-RU" : "en-US",
    options
  ).format(currentDate);

  // Разделяем дату на день и месяц
  const [part1, part2] = formattedDate.split(" ");
  const isEnglish = language === "en";

  // Меняем порядок для английского языка
  const day = isEnglish ? part2 : part1;
  const month = isEnglish ? part1 : part2;

  // Преобразуем первую букву месяца в заглавную
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // Возвращаем результат
  return (
    <div className="current-weather__date">
      {day} {capitalizedMonth} <span>|</span> {currentDate.getFullYear()}
    </div>
  );
};

export default CurrentWeatherDate;
