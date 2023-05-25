import { FC } from 'react'

import { NavigationButton } from '../../styledComponents/navigationButton/NavigationButton'

import s from './tabBar.module.styl'

type PropsType = {

}

export const TabBar: FC<PropsType> = ({ }) => {
    return (
        <div className={s.tabBar}>
            <NavigationButton type='years' label='years' />
            <NavigationButton type='seasons' label='seasons' />
            <NavigationButton type='events' label='events' />
            <NavigationButton type='plans' label='plans' />
        </div>
    )
}