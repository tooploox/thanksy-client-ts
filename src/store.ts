import { LoopReducer, install, combineReducers, Cmd } from "redux-loop"
import { Store, compose, createStore, Dispatch, applyMiddleware } from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { createBrowserHistory } from "history"
import { createAction, extend } from "./utils/redux"
import { loadFeed } from "./api"
import { cheerBase64 } from "./assets/audio"

export type MapState<TS, TO = any> = (state: RootState, props: TO) => TS
export type MapDispatch<TA, TO = any> = (dispatch: Dispatch<any>, props: TO) => TA
export type Actions = ReturnType<typeof actions[keyof typeof actions]>

export const initialAppState: AppState = {
    thxList: [],
    recentThxList: [],
    notifications: [],
    lastThxId: -1,
    status: "Loading"
}

export const initialState: RootState = { app: initialAppState } as any

export const actions = {
    updateThxList: () => createAction("updateThxList"),
    setThxList: (thxList: Thx[]) => createAction("setThxList", thxList),
    setThxListFailed: (error: Error) => createAction("setThxListFailed", error),
    clearNotification: (id: string) => createAction("clearNotification", id),
    updateLastThxId: (id: number) => createAction("updateLastThxId", id),
    setStatus: (status: AppStatus) => createAction("setStatus", status)
}

const loadFeedCmd = () =>
    Cmd.run(loadFeed, {
        successActionCreator: actions.setThxList,
        failActionCreator: actions.setThxListFailed
    })

export const splitThxLists = (ts: Thx[], lastThxId: number): Lists => ({
    thxList: (lastThxId === -1 ? ts : ts.filter(v => v.id <= lastThxId)).sort((l, r) => r.id - l.id),
    recentThxList: (lastThxId === -1 ? [] : ts.filter(v => v.id > lastThxId)).sort((l, r) => l.id - r.id),
    // TESTING HACK: to always display last thx as freshone
    lastThxId: lastThxId === -1 ? (ts && ts.length > 1 ? ts[1].id : -1) : lastThxId
})

const clearNotificationCmd = (id: string) =>
    Cmd.run(() => new Promise(r => setTimeout(() => r(id), 7500)), { successActionCreator: actions.clearNotification })

const updateLastThxIdCmd = (id: number) =>
    Cmd.run(() => new Promise(r => setTimeout(() => r(id), 9500)), { successActionCreator: actions.updateLastThxId })

const cheerSound = new Audio(cheerBase64)
const isLocalHost = window.location.toString().indexOf("localhost") !== -1
const playCheersAudioCmd = () =>
    Cmd.run(
        async () => {
            if (isLocalHost) throw new Error("NO_SOUND_SET")
            cheerSound.play()
        },
        { successActionCreator: () => ({ type: "audioPlayed" }), failActionCreator: () => ({ type: "noAudioPlayed" }) }
    )

const AppNotification = (text: string): AppNotification => ({ text, notificationId: new Date().getTime().toString() })

export const reducer: LoopReducer<AppState, Actions> = (state, action: Actions) => {
    if (!state) return initialState.app
    const ext = extend(state)
    switch (action.type) {
        case "updateThxList":
            return ext({ status: "Loading" }, loadFeedCmd())

        case "setThxList": {
            const delta = splitThxLists(action.payload, state.lastThxId)
            return delta.recentThxList.length
                ? ext(delta, Cmd.list([updateLastThxIdCmd(delta.recentThxList[0].id), playCheersAudioCmd()]))
                : ext(delta)
        }

        case "setThxListFailed": {
            const notifications = [AppNotification(action.payload.message), ...state.notifications]
            return ext({ notifications }, clearNotificationCmd(notifications[0].notificationId))
        }

        case "updateLastThxId":
            return ext(splitThxLists([...state.thxList, ...state.recentThxList], action.payload))

        case "clearNotification": {
            const notifications = state.notifications.filter(({ notificationId }) => notificationId !== action.payload)
            return ext({ notifications })
        }
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
            isLocalHost ? devTools() : f => f,
            applyMiddleware(routerMiddleware(getHistory()))
        )
    )
    _store.dispatch(actions.updateThxList())

    setInterval(() => _store.dispatch(actions.updateThxList()), 15000)
    return _store
}
