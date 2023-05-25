import { FC } from 'react'

type PropsType = {
    size?: string
    color?: string
    backgroundColor?: string
}

export const BackIcon: FC<PropsType> = ({ size = '34', color = "#747474" }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 72 72" id="emoji" xmlns="http://www.w3.org/2000/svg">
            <g id="color" />
            <g id="hair" />
            <g id="skin" />
            <g id="skin-shadow" />
            <g id="line">
                <polyline fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round"
                    strokeMiterlimit="10" strokeWidth="2"
                    points="46.1964,16.2048 26.8036,35.6651 46.1964,55.1254" />
            </g>
        </svg>
    )
}
