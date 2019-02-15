import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Main } from "./Main"
import { getStore } from "./store"
import { selectCreateDiv } from "./utils/html5"

render(
    <Provider store={getStore()}>
        <Main />
    </Provider>,
    selectCreateDiv("app")
)
