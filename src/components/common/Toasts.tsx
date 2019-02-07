import * as React from "react"
import * as ReactDOM from "react-dom"
import { SmoothList } from "./SmoothList"
import { bind } from "../../utils/bem"
import "./Toasts.scss"
import { Spinner } from "./Spinner"
import { call } from "../../utils"
import { selectCreateDiv } from "../../utils/html5"

const { Block, Element } = bind("Toast")

export interface ToastProps extends AppNotification {
    onClick?: F0
}

const Toast: React.SFC<ToastProps> = ({ children, text, actionText, onClick, type }) => (
    <Block modifiers={{ [type]: true }} onClick={_ => !actionText && call(onClick)}>
        <Element name="Content">{children || text}</Element>
        <Element name={actionText ? "Action" : "Close"} onClick={onClick}>
            {actionText}
        </Element>
    </Block>
)

export interface ToastsStateProps {
    notifications: SMap<AppNotification>
    backgroundTask: boolean
}
export interface ToastsActionProps {
    onClick?: (key: string) => void
}

export const Toasts: React.SFC<ToastsStateProps & ToastsActionProps> = props =>
    ReactDOM.createPortal(
        <div className="Toasts">
            <SmoothList
                maxHeight={60}
                items={props.notifications}
                onClick={props.onClick}
                renderer={(item, _, onClick) => <Toast {...item} onClick={onClick} />}
            />
            <div className="BackgroundTask" style={{ opacity: +props.backgroundTask }}>
                <Spinner />
            </div>
        </div>,
        selectCreateDiv("toasts")
    )
