import React from 'react';

import { Provider } from 'jotai';
import { AliveScope } from 'react-activation';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import i18n from './i18n';
import './index.css';

// Функция для входа в полноэкранный режим
function enterFullscreen() {
  document.documentElement.requestFullscreen();
}

// Обработчик события visibilitychange
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    enterFullscreen();
  }
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AliveScope>
      <Provider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    </AliveScope>
  </BrowserRouter>,
  // </React.StrictMode>
);
