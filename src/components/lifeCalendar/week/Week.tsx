import { FC } from 'react'

import s from './week.module.styl'

type PropsType = {
    id: string
}

export const Week: FC<PropsType> = ({id}) => {
    return (
        <div className={s.week}>
            {id}
        </div>
    )
}