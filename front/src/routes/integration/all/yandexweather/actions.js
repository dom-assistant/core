import { RequestStatus } from '../../../../utils/consts';

const actions = store => ({
  updateApiKey(state, e) {
    store.setState({
      yandexWeatherApiKey: e.target.value
    });
  },
  async getApiKey(state) {
    store.setState({
      yandexWeatherGetApiKeyStatus: RequestStatus.Getting
    });
    try {
      const variable = await state.httpClient.get('/api/v1/service/yandexweather/variable/YANDEXWEATHER_API_KEY');
      store.setState({
        yandexWeatherApiKey: variable.value,
        yandexWeatherGetApiKeyStatus: RequestStatus.Success
      });
    } catch (e) {
      store.setState({
        yandexWeatherGetApiKeyStatus: RequestStatus.Error
      });
    }
  },
  async saveApiKey(state, e) {
    e.preventDefault();
    store.setState({
      yandexWeatherSaveApiKeyStatus: RequestStatus.Getting
    });
    try {
      store.setState({
        yandexWeatheryApiKey: state.yandexWeatherApiKey.trim()
      });
      // save api key
      await state.httpClient.post('/api/v1/service/yandexweather/variable/YANDEXWEATHER_API_KEY', {
        value: state.yandexWeatherApiKey.trim()
      });
      // start service
      await state.httpClient.post('/api/v1/service/yandexweather/start');
      store.setState({
        yandexWeatherSaveApiKeyStatus: RequestStatus.Success
      });
    } catch (e) {
      store.setState({
        yandexWeatherSaveApiKeyStatus: RequestStatus.Error
      });
    }
  }
});

export default actions;
