import * as React from "react"
import * as ReactDOM from "react-dom"
import { SmoothList } from "./SmoothList"
import { bind } from "../../utils/bem"
import { Spinner } from "./Spinner"
import { call } from "../../utils"
import { selectCreateDiv } from "../../utils/html5"

import "./Toasts.scss"

const { Block, Element } = bind("Toast")

export type ToastProps = AppNotification & { onClick?: F0 }
const Toast: React.SFC<ToastProps> = ({ children, text, onClick }) => (
    <Block onClick={_ => call(onClick)}>
        <Element name="Content">{children || text}</Element>
        <Element name="Close" onClick={onClick} />
    </Block>
)

export type ToastsStateProps = { notifications: AppNotification[]; backgroundTask: boolean }
export type ToastsActionProps = { onClick?: F1<string> }
export const Toasts: React.SFC<ToastsStateProps & ToastsActionProps> = props =>
    ReactDOM.createPortal(
        <div className="Toasts">
            <SmoothList
                maxHeight={60}
                keyName="notificationId"
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
