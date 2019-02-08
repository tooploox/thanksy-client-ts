import * as React from "react"
import { connect } from "react-redux"
import { ThxList } from "../components/ThxList"
import { MapState } from "../store"
import "./layout.scss"
import { Toasts } from "../components/common/Toasts"
import { Clock } from "../components/common/Clock"

export const MainPlain: React.SFC<AppState> = p => (
    <>
        <ThxList thxList={p.thxList} />
        <Clock />
        <Toasts backgroundTask notifications={{}} />
    </>
)
const mapState: MapState<AppState> = s => s.app
export const Main = connect<AppState>(mapState)(MainPlain)
