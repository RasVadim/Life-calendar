import { FC, ReactNode } from 'react'

import { DefaultUserIcon } from '../../images/defaultUserIcon'

import s from './accountButton.module.styl'

type PropsType = {
    imageUrl?: string
}

export const AccountButton: FC<PropsType> = ({ imageUrl = '' }) => {
    return (
        <button className={s.button}>
            {imageUrl ?
                <img className={s.image} alt='user image' src={imageUrl} /> :
                <DefaultUserIcon />}
        </button>
    )
}