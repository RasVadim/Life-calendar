import { FC } from 'react'
import cx from 'classnames';

import { Week } from '../week/Week'
import type { TWeek } from '../../types'

import s from './s.module.styl'


type PropsType = {
    id: string
    weeks: TWeek[]
    isLast: boolean
}

export const Year: FC<PropsType> = ({ weeks, isLast }) => {
    return (
        <div className={cx(s.year, { [s.leftSide]: isLast })}>
            {weeks.map((week) => (
                <Week key={week.id} id={week.id} />
            ))}
        </div>
    )
}