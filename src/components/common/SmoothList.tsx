import * as React from "react"
import { TransitionMotion } from "react-motion"
import { transitionMotionProps } from "./reactMotionUtils"
import { call } from "../../utils"

export interface SmoothListStateProps<T> {
    maxHeight: number
    items: T[]
    keyName: keyof T
}

export interface SmoothListActionProps<T> {
    onClick?: F1<string>
    renderer: (item: T, path: string, onClick: F0) => React.ReactElement<any>
}
const DELTA = 0.6

export function SmoothList<T>(props: SmoothListStateProps<T> & SmoothListActionProps<T>): React.ReactElement<any> {
    return (
        <TransitionMotion {...transitionMotionProps(props.items, props.keyName, props.maxHeight)}>
            {styles => (
                <>
                    {styles.map(({ key, style, data }: { key: string; style: any; data: T }) => {
                        if (style.height !== 0 && style.height < DELTA && style.height > -DELTA) style.height = 0
                        else if (
                            style.height !== props.maxHeight &&
                            style.height > props.maxHeight - DELTA &&
                            style.height < props.maxHeight + DELTA
                        )
                            style.height = props.maxHeight
                        return (
                            <div style={style} key={key}>
                                {props.renderer(data, key, () => call(props.onClick, key))}
                            </div>
                        )
                    })}
                </>
            )}
        </TransitionMotion>
    )
}
