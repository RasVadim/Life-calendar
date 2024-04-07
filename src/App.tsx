import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";

import { Routes } from "@/Routes";

const App = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Routes />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
