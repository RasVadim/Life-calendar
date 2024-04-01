import { Provider } from "jotai";
import { MainPage, LoginPage } from "@/pages";

import s from "./s.module.styl";

const App = () => {
  return (
    <Provider>
      <div className={s.App}>
        <MainPage />
      </div>
    </Provider>
  );
};

export default App;
