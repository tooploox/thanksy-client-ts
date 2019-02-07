import * as React from "react"
import { connect } from "react-redux"
// import { NewThanks } from "../components/NewThanks"
import { ThxList } from "../components/ThxList"
import { MapState } from "../store"

export const MainPlain: React.SFC<AppState> = p => (
    <>
        <ThxList thxList={p.thxList} />
        {/* <NewThanks recentThanks={this.state.recentThanks} newThanksVisible={this.state.newThanksVisible} /> */}
    </>
)
const mapState: MapState<AppState> = s => s.app
export const Main = connect<AppState>(mapState)(MainPlain)
