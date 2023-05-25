import { FC, ReactNode } from 'react'

import { Header } from '../../components/header/Header'
import { Content } from '../../components/content/Content'
import { TabBar } from '../../components/tabBar/TabBar'

import s from './mainPage.module.styl'

type PropsType = {
    children?: ReactNode
}

export const MainPage: FC<PropsType> = ({ children }) => {
    return (
        <div className={s.page}>
            <Header />
            <Content />
            <TabBar />
        </div>
    )
}
