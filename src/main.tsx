import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
import App from "./App.tsx";
import "./index.css";

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
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
