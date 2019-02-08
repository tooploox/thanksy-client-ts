import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Main } from "./views/Main"
import { Switch, Route } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import { getStore, getHistory } from "./store"
import { selectCreateDiv } from "./utils/html5"

render(
    <Provider store={getStore()}>
        <ConnectedRouter history={getHistory()}>
            <Switch>
                <Route path="/" component={Main} exact />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    selectCreateDiv("app")
)
