import { FC, ReactNode } from 'react'

import { AccountButton } from '../../styledComponents/accountButton/accountButton'
import { NavigationButton } from '../../styledComponents/navigationButton/NavigationButton'

import s from './header.module.styl'

type PropsType = {
    children?: ReactNode
}

export const Header: FC<PropsType> = ({ children = 'Life Calendar' }) => {
    return (
        <div className={s.header}>
            <NavigationButton type='menu' />
            {children}
            <AccountButton />
        </div>
    )
}
