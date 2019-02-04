import { Store, compose, createStore, Dispatch, applyMiddleware } from "redux"
import { install, combineReducers } from "redux-loop"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { createBrowserHistory } from "history"

import { reducer, initialState } from "."

export type MapState<TS, TO = any> = (state: RootState, props: TO) => TS
export type MapDispatch<TA, TO = any> = (dispatch: Dispatch<any>, props: TO) => TA
export type TStore = Store<RootState>

let _history: ReturnType<typeof createBrowserHistory> = null as any
export const getHistory = () => {
    if (!_history) _history = createBrowserHistory()
    return _history
}

let _store: TStore | null = null
const initStore = () => {
    const { __REDUX_DEVTOOLS_EXTENSION__ = () => (f: any) => f } = window as any
    return createStore(
        combineReducers<any>({ app: reducer, router: connectRouter(getHistory()) }),
        initialState as any,
        compose(
            install(),
            __REDUX_DEVTOOLS_EXTENSION__(),
            applyMiddleware(routerMiddleware(getHistory()))
        )
    ) as TStore
}
export const getStore = () => {
    if (!_store) _store = initStore()
    return _store
}
