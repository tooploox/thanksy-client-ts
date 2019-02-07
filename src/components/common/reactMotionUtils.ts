import { TransitionProps, spring, presets, Style, PlainStyle, SpringHelperConfig } from "react-motion"
import { mapObject } from "../../utils"

const getPlainStyle = (height: number, opacity: number): PlainStyle => ({ height, opacity })

const getStyle = (height: number, opacity: number, config: SpringHelperConfig = presets.stiff): Style => ({
    height: spring(height, presets.gentle),
    opacity: spring(opacity, config)
})

export function transitionMotionProps<T>(items: SMap<T>, maxHeight: number): TransitionProps {
    return {
        defaultStyles: mapObject(items, (data, key) => ({ key, data, style: getPlainStyle(0, 0) })),
        styles: mapObject(items, (data, key) => ({ key, data, style: getStyle(maxHeight, 1, presets.stiff) })),
        willEnter: () => getPlainStyle(0, 1),
        willLeave: () => getStyle(0, 0)
    }
}
