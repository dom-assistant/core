const logger = require('../../utils/logger');
const { ServiceNotConfiguredError } = require('../../utils/coreErrors');
const { formatResults } = require('./lib/formatResults');
const { Error400 } = require('../../utils/httpErrors');
const { ERROR_MESSAGES } = require('../../utils/constants');

const YANDEXWEATHER_API_KEY = 'YANDEXWEATHER_API_KEY';

module.exports = function YandexWeatherService(gladys, serviceId) {
  const { default: axios } = require('axios');
  let yandexWeatherApiKey;

  /**
   * @public
   * @description This function starts the service
   * @example
   * gladys.services.yandexWeather.start();
   */
  async function start() {
    logger.info('Starting Yandex Weather service');
    yandexWeatherApiKey = await gladys.variable.getValue(YANDEXWEATHER_API_KEY, serviceId);
    if (!yandexWeatherApiKey) {
      throw new ServiceNotConfiguredError('Yandex Weather Service not configured');
    }
  }

  /**
   * @public
   * @description This function stops the service
   * @example
   * gladys.services.yandexWeather.stop();
   */
  async function stop() {
    logger.info('Stopping Yandex Weather service');
  }

  /**
   * @description Get the weather.
   * @param {Object} options - Options parameters.
   * @param {number} options.latitude - The latitude to get the weather from.
   * @param {number} options.longitude - The longitude to get the weather from.
   * @param {number} options.offset - Get weather in the future, offset is in hour.
   * @param {string} [options.language] - The language of the report.
   * @param {string} [options.units] - Unit of the weather [metric, us].
   * @example
   * gladys.services.yandexWeather.weather.get({
   *   latitude: 112,
   *   longitude: -2,
   *   offset: 0,
   *   language: 'fr',
   *   units: 'metric',
   * });
   */
  async function get(options) {
    const optionsModified = {
      ...options,
      units: options.units === 'us' ? 'imperial' : 'metric',
    };
    const DEFAULT = {
      language: 'ru',
      units: 'metric',
      offset: 0,
    };
    const optionsMerged = { ...DEFAULT, ...optionsModified };
    const { latitude, longitude, language, units } = optionsMerged;

    if (!yandexWeatherApiKey) {
      throw new ServiceNotConfiguredError('Yandex Weather API Key not found');
    }
    const url = `https://api.weather.yandex.ru/v2/informers?lat=${latitude}&lon=${longitude}&lang=${language}&units=${units}&cnt=1&appid=${yandexWeatherApiKey}`;
    try {
      logger.log(`YandexWeather URL : ${url}`);
      const { data } = await axios.get(url);
      const weatherFormatted = formatResults(optionsMerged, data);
      return weatherFormatted;
    } catch (e) {
      logger.error(e);
      throw new Error400(ERROR_MESSAGES.REQUEST_TO_THIRD_PARTY_FAILED);
    }
  }

  return Object.freeze({
    start,
    stop,
    weather: {
      get,
    },
  });
};
