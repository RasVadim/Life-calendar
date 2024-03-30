import { FC, ReactNode } from 'react'

import { AccountButton, NavigationButton } from '@/ui-kit'

import s from './s.module.styl'

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
