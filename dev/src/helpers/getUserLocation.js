export const getUserLocation = (language, onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess(latitude, longitude);
      },
      (error) => {
        console.error(
          language === "ru"
            ? "Ошибка при получении местоположения:"
            : "Error getting location:",
          error.message
        );
        onError(
          language === "ru"
            ? "Геолокация отключена :("
            : "Geolocation disabled :("
        );
      }
    );
  } else {
    onError(
      language === "ru"
        ? "Геолокация не поддерживается вашим браузером :("
        : "Geolocation is not supported by your browser :("
    );
  }
};
