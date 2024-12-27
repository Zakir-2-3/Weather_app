import { getLocalizedText } from "../../../utils/languageUtils";
import { capitalizeFirstLetter } from "../../../helpers/capitalize";

import temperatureIcon from "../../../assets/icons/other-icons/temperature-icon.svg";
import pressureIcon from "../../../assets/icons/other-icons/pressure-icon.svg";
import humidityIcon from "../../../assets/icons/other-icons/humidity-icon.svg";
import windSpeedIcon from "../../../assets/icons/other-icons/wind-speed-icon.svg";
import sunriseIcon from "../../../assets/icons/other-icons/sunrise-icon.svg";
import sunsetIcon from "../../../assets/icons/other-icons/sunset-icon.svg";
import weatherDescriptionIcon from "../../../assets/icons/other-icons/weather-description-icon.svg";

import "./CurrentForecastContainer.scss";

function CurrentForecastContainer({ forecastData, language }) {
  const {
    temp = "-",
    pressure = "-",
    humidity = "-",
    windSpeed = "-",
    sunrise = "-",
    sunset = "-",
    description = "-",
  } = forecastData;

  return (
    <div className="current-forecast__container">
      <div className="current-temperature">
        <img
          src={temperatureIcon}
          alt={getLocalizedText("temperature", language)}
        />
        &nbsp;
        <p>{getLocalizedText("temperature", language)}:</p>
        &nbsp;
        <p>{temp} °C</p>
      </div>
      <div className="current-pressure">
        <img src={pressureIcon} alt={getLocalizedText("pressure", language)} />
        &nbsp;
        <p>{getLocalizedText("pressure", language)}:</p>
        &nbsp;
        <p>
          {pressure} {getLocalizedText("pressureUnit", language)}
        </p>
      </div>
      <div className="current-humidity">
        <img src={humidityIcon} alt={getLocalizedText("humidity", language)} />
        &nbsp;
        <p>{getLocalizedText("humidity", language)}:</p>
        &nbsp;
        <p>{humidity} %</p>
      </div>
      <div className="current-wind-speed">
        <img
          src={windSpeedIcon}
          alt={getLocalizedText("windSpeed", language)}
        />
        &nbsp;
        <p>{getLocalizedText("windSpeed", language)}:</p>
        &nbsp;
        <p>
          {windSpeed} {getLocalizedText("windSpeedUnit", language)}
        </p>
      </div>
      <div className="current-sunrise-time">
        <img src={sunriseIcon} alt={getLocalizedText("sunrise", language)} />
        &nbsp;
        <p className="sunrise">{getLocalizedText("sunrise", language)}:</p>
        &nbsp;
        <p>{sunrise}</p>
      </div>
      <div className="current-sunset-time">
        <img src={sunsetIcon} alt={getLocalizedText("sunset", language)} />
        &nbsp;
        <p className="sunset">{getLocalizedText("sunset", language)}:</p>
        &nbsp;
        <p>{sunset}</p>
      </div>
      <div className="current-weather-description">
        <img
          src={weatherDescriptionIcon}
          alt={getLocalizedText("weatherDescription", language)}
        />
        &nbsp;
        <p>{getLocalizedText("weatherDescription", language)}:</p>
        &nbsp;
        <p>{capitalizeFirstLetter(description)}</p>
      </div>
    </div>
  );
}

export default CurrentForecastContainer;
