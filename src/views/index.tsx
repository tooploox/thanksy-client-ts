import * as React from "react"
import { Main } from "./main"
import { Switch, Route } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import { getHistory } from "../store/"
import "./layout.scss"

export const paths = {
    main: "/"
}

export const Routes = () => (
    <ConnectedRouter history={getHistory()}>
        <Switch>
            <Route path={paths.main} component={Main} exact />
        </Switch>
    </ConnectedRouter>
)
