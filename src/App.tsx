import { MainPage } from './pages/main/MainPage'
import { LoginPage } from './pages/login/LoginPage'

import s from './App.module.styl'

const App = () => {
  return (
    <div className={s.App}>
      <MainPage />
    </div>
  )
}

export default App