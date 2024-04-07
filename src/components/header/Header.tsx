import { FC, ReactNode } from 'react'

import { AccountButton, Button } from '@/ui-kit'

import s from './s.module.styl'
import { BurgerMenu } from '../burgeMenu/BurgerMenu'

type PropsType = {
    children?: ReactNode
}

export const Header: FC<PropsType> = ({ children = 'Life Calendar' }) => {
    return (
        <div className={s.header}>
            {/* <Button icon='menu' /> */}
            <BurgerMenu/>
            {children}
            <AccountButton />
        </div>
    )
}
