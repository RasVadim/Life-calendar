import { FC } from 'react'

import { MenuIcon } from '../../images/menuIcon'
import { BackIcon } from '../../images/backIcon'
import { YearsIcon } from '../../images/yearsIcon'
import { SeasonsIcon } from '../../images/seasonsIcon'
import { EventsIcon } from '../../images/eventsIcon'
import { PlansIcon } from '../../images/plansIcon'

import s from './navigationButton.module.styl'

type PropsType = {
    type: 'menu' | 'back' | 'years' | 'seasons' | 'events' | 'plans'
    label?: string
}

export const NavigationButton: FC<PropsType> = ({ type = '', label }) => {
    const icon = {
        menu: <MenuIcon />,
        back: <BackIcon />,
        years: <YearsIcon />,
        seasons: <SeasonsIcon />,
        events: <EventsIcon />,
        plans: <PlansIcon />
    }[type]

    return (
        <div className={s.wrap}>
            <button className={s.button}>
                {icon}
            </button>
            {label && <p className={s.label}>
                {label}
            </p>}
        </div>
    )
}