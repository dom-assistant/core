import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import YandexWeatherPage from './YandexWeather';
import { RequestStatus } from '../../../../utils/consts';

@connect('user,yandexWeatherApiKey,yandexWeatherSaveApiKeyStatus,yandexWeatherGetApiKeyStatus', actions)
class YandexWeatherIntegration extends Component {
  componentWillMount() {
    this.props.getApiKey();
  }

  render(props, {}) {
    const loading =
      props.yandexWeatherSaveApiKeyStatus === RequestStatus.Getting ||
      props.yandexWeatherGetApiKeyStatus === RequestStatus.Getting;
    return <YandexWeatherPage {...props} loading={loading} />;
  }
}

export default YandexWeatherIntegration;
