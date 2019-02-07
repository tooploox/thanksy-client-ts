import { LoopReducer, install, combineReducers, Cmd } from "redux-loop"
import { Store, compose, createStore, Dispatch, applyMiddleware } from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { createBrowserHistory } from "history"
import { createAction, extend } from "./utils/redux"
import { loadFeed } from "./api"

export type MapState<TS, TO = any> = (state: RootState, props: TO) => TS
export type MapDispatch<TA, TO = any> = (dispatch: Dispatch<any>, props: TO) => TA
export type Actions = ReturnType<typeof actions[keyof typeof actions]>
export const initialAppState: AppState = { thxList: [], recentThxList: [], error: null }
export const initialState: RootState = { app: initialAppState } as any

export const actions = {
    updateThxList: () => createAction("updateThxList"),
    setThxList: (thxList: Thx[]) => createAction("setThxList", thxList),
    setThxListFailed: (error: Error) => createAction("setThxListFailed", error)
}

const loadFeedCmd = () =>
    Cmd.run(loadFeed, {
        successActionCreator: actions.setThxList,
        failActionCreator: actions.setThxListFailed
    })

export const reducer: LoopReducer<AppState, Actions> = (state, action: Actions) => {
    if (!state) return initialState.app
    const ext = extend(state)
    switch (action.type) {
        case "updateThxList":
            return ext({}, loadFeedCmd())

        case "setThxList":
            return ext({ thxList: action.payload })

        case "setThxListFailed":
            return ext({ error: action.payload })
    }
    return state
}

let _history: ReturnType<typeof createBrowserHistory>
export const getHistory = () => {
    if (!_history) _history = createBrowserHistory()
    return _history
}

const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || (<T>(f: T): T => f)
let _store: Store<RootState>
export const getStore = () => {
    if (_store) return _store
    _store = createStore(
        combineReducers<any>({ app: reducer, router: connectRouter(getHistory()) }),
        initialState as any,
        compose(
            install(),
            devTools(),
            applyMiddleware(routerMiddleware(getHistory()))
        )
    )
    _store.dispatch(actions.updateThxList())
    setInterval(() => _store.dispatch(actions.updateThxList()), 5000)
    return _store
}
