import { FC, ReactNode } from 'react'
import s from './s.module.styl'

type PropsType = {
    children: ReactNode
}

export const LoginPage: FC<PropsType> = ({ children }) => {
    return (
        <div className={s.page}>
            {children}
        </div>
    )
}
