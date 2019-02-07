import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Main } from "./views/main"
import { Switch, Route } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import { getStore, getHistory } from "./store"
import "./layout.scss"

export const paths = { root: "/" }

render(
    <Provider store={getStore()}>
        <ConnectedRouter history={getHistory()}>
            <Switch>
                <Route path={paths.root} component={Main} exact />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("app")
)
