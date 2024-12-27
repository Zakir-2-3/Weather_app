import { capitalizeFirstLetter } from "../../../helpers/capitalize";

import "./CurrentWeatherDescription.scss";

function CurrentWeatherDescription({ description }) {
  return (
    <div className="current-weather__description">
      {capitalizeFirstLetter(description)}
    </div>
  );
}

export default CurrentWeatherDescription;
