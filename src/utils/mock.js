import AxiosMockAdapter from 'axios-mock-adapter';
import axios_old from './axios_old';

const axiosMockAdapter = new AxiosMockAdapter(axios_old, { delayResponse: 0 });

export default axiosMockAdapter;
