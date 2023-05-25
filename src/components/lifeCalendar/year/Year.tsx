import { FC } from 'react'
import cx from 'classnames';

import { Week } from '../week/Week'
import { WeekType } from '../types'

import s from './year.module.styl'


type PropsType = {
    id: string
    weeks: WeekType[]
    isLast: boolean
}

export const Year: FC<PropsType> = ({ id, weeks, isLast }) => {
    return (
        <div className={cx(s.year, { [s.leftSide]: isLast })}>
            {weeks.map((w) => (
                <Week key={w.id} id={w.id} />
            ))}
        </div>
    )
}