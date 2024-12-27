import { useState } from "react";

import {
  sanitizeCityInput,
  sanitizeCoordinateInput,
} from "../../../helpers/sanitizeNumberInput";
import { getUserLocation } from "../../../helpers/getUserLocation";
import { getLocalizedText } from "../../../utils/languageUtils";

import GpsIcon from "../../../assets/icons/other-icons/gps-icon.svg?react";
import searchIcon from "../../../assets/icons/other-icons/search-icon.svg";

import "./SearchForecastContainer.scss";

const SearchForecastContainer = ({ onSearch, language }) => {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [fillColor, setFillColor] = useState("#fff");

  const handleCityChange = (e) => {
    setCity(sanitizeCityInput(e.target.value, setLatitude, setLongitude));
  };

  const handleLatitudeChange = (e) => {
    setLatitude(sanitizeCoordinateInput(e.target.value, setCity));
  };

  const handleLongitudeChange = (e) => {
    setLongitude(sanitizeCoordinateInput(e.target.value, setCity));
  };

  const handleSearch = () => {
    onSearch({ city, latitude, longitude });
  };

  const handleLocation = () => {
    getUserLocation(
      language,
      (lat, lon) => {
        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setCity("");
        onSearch({ latitude: lat, longitude: lon });
        setFillColor("#4ac14f");
      },
      (errorMessage) => {
        setFillColor("#d50303");
        alert(errorMessage);
      }
    );
  };

  return (
    <div className="search-forecast__container">
      <div className="main-input__container">
        <button
          onClick={handleLocation}
          title={getLocalizedText("hoverMyLocation", language)}
        >
          <GpsIcon fill={fillColor} />
        </button>
        <input
          type="text"
          placeholder={getLocalizedText("enterCity", language)}
          value={city}
          onChange={handleCityChange}
          title={getLocalizedText("hoverCity", language)}
        />
        <button
          onClick={handleSearch}
          title={getLocalizedText("getWeather", language)}
        >
          <img
            src={searchIcon}
            alt={getLocalizedText("getWeather", language)}
          />
        </button>
      </div>
      <div className="coordinates-input__container">
        <input
          type="text"
          className="coordinates-input"
          value={latitude}
          onChange={handleLatitudeChange}
          placeholder={getLocalizedText("enterLatitude", language)}
          title={getLocalizedText("enterLatitude", language)}
        />
        <input
          type="text"
          className="coordinates-input"
          value={longitude}
          onChange={handleLongitudeChange}
          placeholder={getLocalizedText("enterLongitude", language)}
          title={getLocalizedText("enterLongitude", language)}
        />
      </div>
    </div>
  );
};

export default SearchForecastContainer;
