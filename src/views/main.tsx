import * as React from "react"
import { connect } from "react-redux"
import { ThxList } from "../components/ThxList"
import { MapState } from "../store"
import { Toasts } from "../components/common/Toasts"
import { Clock } from "../components/common/Clock"
import { ModalAnimated } from "../components/common/ModalAnimated"
import { NewThx } from "../components/NewThx"
import "./Main.scss"

export const MainPlain: React.SFC<AppState> = p => (
    <>
        <ThxList thxList={p.thxList} />
        <Clock />
        <div className="Version">Thanksy 2.0</div>
        <Toasts backgroundTask notifications={p.notifications} />
        <ModalAnimated isOpened={p.thxList.length > 0 && false}>
            <NewThx newThanksVisible recentThanks={p.thxList[0]} />
        </ModalAnimated>
    </>
)
const mapState: MapState<AppState> = s => s.app
export const Main = connect<AppState>(mapState)(MainPlain)
