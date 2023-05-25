import { FC } from 'react'

import { Year } from './year/Year'
import { YearType } from './types'
import { USER_AGE } from '../../constants/user'

import s from './lifeCalendar.module.styl'


type PropsType = {
    years: YearType[]
}

export const LifeCalendar: FC<PropsType> = ({ years }) => {

    return (
        <div className={s.calendar}>
            {years.map((y) => (
                <Year 
                key={y.id} 
                id={y.id} 
                weeks={y.weeks} 
                isLast={y.id === 'y' + USER_AGE} 
                />
            ))}
        </div>
    )
}