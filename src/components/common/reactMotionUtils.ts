import { TransitionProps, spring, presets, Style, PlainStyle, SpringHelperConfig } from "react-motion"

const getPlainStyle = (height: number, opacity: number): PlainStyle => ({ height, opacity })

const getStyle = (height: number, opacity: number, config: SpringHelperConfig = presets.stiff): Style => ({
    height: spring(height, presets.gentle),
    opacity: spring(opacity, config)
})

export type StyledData<T> = { data: T; key: string; style: any }
const StyledData = <T>(data: T, keyName: keyof T, style: any): StyledData<T> => ({
    data,
    key: data[keyName].toString(),
    style
})

export const transitionMotionProps = <T>(items: T[], keyName: keyof T, maxHeight: number): TransitionProps => ({
    defaultStyles: items.map(data => StyledData(data, keyName, getPlainStyle(0, 0))),
    styles: items.map(data => StyledData(data, keyName, getStyle(maxHeight, 1, presets.stiff))),
    willEnter: () => getPlainStyle(0, 1),
    willLeave: () => getStyle(0, 0)
})
