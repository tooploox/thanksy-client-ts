import * as React from "react"
import { connect } from "react-redux"
import { ThxList } from "./components/ThxList"
import { MapState, equal } from "./store"
import { Toasts } from "./components/common/Toasts"
import { Clock } from "./components/common/Clock"
import { ModalAnimated } from "./components/common/ModalAnimated"
import { NewThx } from "./components/NewThx"
import "./Main.scss"
import { Login } from "./components/Login"
import { Version } from "./components/common/Version"
import { Just } from "./models"

export const MainPure: React.SFC<AppState> = p => {
    const isLoginOpened =
        equal(p.apiState, Just<ApiState>("InvalidToken")) || equal(p.apiState, Just<ApiState>("TokenNotChecked"))
    const isNewThxOpened = p.recentThxList.length > 0

    return (
        <>
            <ThxList thxList={p.thxList} />
            <Clock />
            <Version />
            <Toasts backgroundTask={false} notifications={p.notifications} />

            <ModalAnimated isOpened={isNewThxOpened}>
                {isNewThxOpened && <NewThx thx={p.recentThxList[0]} />}
            </ModalAnimated>

            <ModalAnimated isOpened={isLoginOpened}>
                <Login />
            </ModalAnimated>
        </>
    )
}

const mapState: MapState<AppState> = s => s.app
export const Main = connect<AppState>(mapState)(MainPure)
