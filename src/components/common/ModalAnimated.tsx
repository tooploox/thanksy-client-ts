import * as React from "react"
import * as ReactDOM from "react-dom"
import { Motion, spring, PlainStyle, presets } from "react-motion"
import { bind } from "../../utils/bem"
import { call } from "../../utils"

import "./ModalAnimated.scss"
import { selectCreateDiv } from "../../utils/html5"
const { Element, Block } = bind("ModalAnimated")

interface Props {
    onClose?: F0
    isOpened: boolean
    children: (motion: PlainStyle, isVisible: boolean, isAnimated: boolean) => React.ReactElement<any>
    onHide?: F0
    noKeysSupport?: boolean
}

const state = {
    isPortalOpened: false,
    isVisible: false,
    isAnimated: false
}

export class ModalWrapper extends React.Component<Props, typeof state> {
    state = state
    private _unmounted = false

    componentWillMount() {
        if (!this.props.isOpened) return
        this.setState({ isPortalOpened: true, isVisible: true })
    }

    componentDidMount() {
        if (!this.props.noKeysSupport) window.addEventListener("keydown", this.handleKey)
    }

    componentWillReceiveProps(nextProps: Props) {
        const { isOpened } = this.props
        const { isVisible, isPortalOpened } = this.state

        const willOpen = !isOpened && nextProps.isOpened
        if (willOpen) this.setState({ isPortalOpened: true, isAnimated: true })

        const willClose = isOpened && !nextProps.isOpened
        if (willClose) this.setState({ isVisible: false, isAnimated: true })

        const hasReopened = willOpen && !isVisible && isPortalOpened
        if (hasReopened) this.setState({ isVisible: true, isAnimated: true })
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.props.isOpened || prevProps.isOpened) return
        window.requestAnimationFrame(() => {
            if (!this._unmounted) this.setState({ isVisible: true })
        })
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKey)
        this._unmounted = true
    }

    handleKey = (e: any) => {
        if (e.which === 27 && this.state.isPortalOpened && this.props.onClose) this.props.onClose()
    }

    handleRest = () => {
        if (!this.state.isVisible) {
            this.setState({ isPortalOpened: false, isAnimated: false })
            call(this.props.onHide)
        } else {
            this.setState({ isAnimated: false })
        }
    }

    render() {
        const { children } = this.props
        const { isPortalOpened, isVisible, isAnimated } = this.state
        if (!isPortalOpened) return null

        const motionStyle = () => ({
            opacity: spring(isVisible ? 1 : 0, presets.gentle),
            modalOffset: spring(isVisible ? 0 : -20, presets.gentle)
        })
        return ReactDOM.createPortal(
            <Motion onRest={this.handleRest} style={motionStyle()}>
                {motion => children(motion, isVisible, isAnimated)}
            </Motion>,
            selectCreateDiv("modals")
        )
    }
}

interface ModalProps {
    isOpened: boolean
    onClose?: F0
    overlayBg?: string
    full?: boolean
    buttons?: F0<JSX.Element>
    withMargin?: number
}

export const ModalAnimated: React.SFC<ModalProps> = ({ isOpened, onClose, children, full, overlayBg }) => (
    <ModalWrapper isOpened={isOpened} onClose={onClose}>
        {(motion, isVisible) => {
            const style: React.CSSProperties = { pointerEvents: isVisible ? "auto" : "none" }
            return (
                <Block modifiers={{ isVisible, full: full || false }} style={style}>
                    <Element
                        name="Overlay"
                        onClick={onClose || (() => null)}
                        style={{ opacity: motion.opacity, ...style, ...(overlayBg ? { background: overlayBg } : {}) }}
                    >
                        {children}
                    </Element>
                </Block>
            )
        }}
    </ModalWrapper>
)
