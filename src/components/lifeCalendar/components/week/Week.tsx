import { FC } from 'react'

import { IWeek } from '@/store/clientDB'

import { getBGColor, getBorderColor } from './utils'

import s from './s.module.styl'

type PropsType = {
    id: string
    week: IWeek
}

export const Week: FC<PropsType> = ({id, week}) => {

  const bGColor = getBGColor(week.type);
  const borderColor = getBorderColor(week.holidays);

    return (
        <div className={s.week}
         style={{ backgroundColor: bGColor, borderColor: borderColor }}
         >
            {id}
        </div>
    )
}