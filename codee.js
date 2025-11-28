if (isDeviceOffline(dev) && type) {
  cityMap[cityName].offline[type] = (cityMap[cityName].offline[type] || 0) + 1;
}