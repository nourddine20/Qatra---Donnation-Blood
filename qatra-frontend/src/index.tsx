import App from '@app/App';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import './index.scss';
import { store } from './store/store';
import './utils/i18n';

export const { VITE_NODE_ENV, VITE_GA_ID } = import.meta.env;

if (VITE_NODE_ENV === 'production' && VITE_GA_ID) {
  ReactGA.initialize(VITE_GA_ID);
}

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
