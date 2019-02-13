import { LoopReducer, install, combineReducers, Cmd } from "redux-loop"
import { compose, createStore, applyMiddleware } from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { createBrowserHistory } from "history"
import { createAction, extend } from "./utils/redux"
import { loadFeed } from "./api"
import { cheerBase64 } from "./assets/audio"
import { Nothing, parseApiState, Just, equal } from "./models"
import { MapDispatchToPropsNonObject } from "react-redux"

export type MapState<TS, TO = {}> = (state: RootState, props: TO) => TS
export type MapDispatch<TA, TO = {}> = MapDispatchToPropsNonObject<TA, TO>
export type Actions = ReturnType<typeof actions[keyof typeof actions]>

export const initialAppState: AppState = {
    thxList: [],
    recentThxList: [],
    notifications: [],
    lastThxId: -1,
    token: "",
    isTokenFresh: true,
    apiState: Nothing()
}

export const initialState: RootState = { app: initialAppState } as any

export const actions = {
    loadToken: () => createAction("loadToken"),
    loadTokenSuccess: (token: string) => createAction("loadTokenSuccess", token),

    updateToken: (token: string) => createAction("updateToken", token),
    updateTokenSuccess: (token: string) => createAction("updateTokenSuccess", token),
    login: () => createAction("login"),

    updateThxList: () => createAction("updateThxList"),
    updateThxListSuccess: (thxList: Thx[]) => createAction("updateThxListSuccess", thxList),
    updateThxListFail: (error: Error) => createAction("updateThxListFail", error),

    clearNotification: (id: string) => createAction("clearNotification", id),

    setLastThxId: (id: number) => createAction("setLastThxId", id),

    setApiState: (error: Maybe<ApiState>) => createAction("setApiState", error)
}

const loadFeedCmd = (token: string) =>
    Cmd.run(() => loadFeed(token), {
        successActionCreator: actions.updateThxListSuccess,
        failActionCreator: actions.updateThxListFail
    })

const TOKEN_KEY = "ThanksyToken"
const storeTokenCmd = (token: string) =>
    Cmd.run(
        async () => {
            localStorage.setItem(TOKEN_KEY, token)
            return token
        },
        {
            successActionCreator: actions.updateTokenSuccess
        }
    )

const loadTokenCmd = () =>
    Cmd.run(async () => localStorage.getItem(TOKEN_KEY) || "", {
        successActionCreator: actions.loadTokenSuccess
    })

export const splitThxLists = (ts: Thx[], lastThxId: number): Lists => ({
    thxList: (lastThxId === -1 ? ts : ts.filter(v => v.id <= lastThxId)).sort((l, r) => r.id - l.id),
    recentThxList: (lastThxId === -1 ? [] : ts.filter(v => v.id > lastThxId)).sort((l, r) => l.id - r.id),
    lastThxId: lastThxId === -1 ? (ts && ts.length > 0 ? ts[0].id : -1) : lastThxId
})

const clearNotificationCmd = (id: string) =>
    Cmd.run(() => new Promise(r => setTimeout(() => r(id), 2500)), { successActionCreator: actions.clearNotification })

export const updateLastThxIdCmd = (id: number) =>
    Cmd.run(() => new Promise(r => setTimeout(() => r(id), 9000)), { successActionCreator: actions.setLastThxId })

export const cheerSound = new Audio(cheerBase64)
const isLocalHost = window.location.toString().indexOf("localhost") !== -1
const playCheersAudioCmd = () =>
    Cmd.run(
        async () => {
            if (isLocalHost) throw new Error("NO_SOUND_SET")
            await cheerSound.play()
        },
        { successActionCreator: () => ({ type: "audioPlayed" }), failActionCreator: () => ({ type: "noAudioPlayed" }) }
    )

const AppNotification = (text: string): AppNotification => ({ text, notificationId: new Date().getTime().toString() })

const ApiErrorNotification = ({ value }: Some<ApiState>) =>
    AppNotification(value === "NoResponse" ? "Server connection problem" : "Invalid token")

export const reducer: LoopReducer<AppState, Actions> = (state, action: Actions) => {
    if (!state) return initialState.app
    const ext = extend(state)
    switch (action.type) {
        case "loadToken":
            return ext({}, loadTokenCmd())

        case "loadTokenSuccess":
            return ext({ token: action.payload }, loadFeedCmd(action.payload))

        case "updateToken":
            return ext({}, storeTokenCmd(action.payload))

        case "updateTokenSuccess":
            return ext({ token: action.payload, isTokenFresh: true })

        case "login":
            return ext({ apiState: Just<ApiState>("TokenNotChecked") }, loadFeedCmd(state.token))

        case "setApiState":
            return ext({ apiState: action.payload })

        case "updateThxList":
            if (state.apiState.type === "nothing" || equal(state.apiState, Just<ApiState>("TokenNotChecked")))
                return ext({ isTokenFresh: false }, loadFeedCmd(state.token))
            return state

        case "updateThxListSuccess": {
            const delta: Partial<AppState> & Lists = {
                ...splitThxLists(action.payload, state.lastThxId),
                apiState: Nothing(),
                isTokenFresh: false
            }
            return delta.recentThxList.length
                ? ext(delta, Cmd.list([updateLastThxIdCmd(delta.recentThxList[0].id), playCheersAudioCmd()]))
                : ext(delta)
        }

        case "updateThxListFail": {
            const apiState = parseApiState(action.payload.message)
            if (apiState.value === "InvalidToken") return ext({ isTokenFresh: false, apiState })
            const notifications = [ApiErrorNotification(apiState), ...state.notifications]
            return ext(
                { notifications, apiState, isTokenFresh: false },
                clearNotificationCmd(notifications[0].notificationId)
            )
        }

        case "setLastThxId":
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

const devTools = () => {
    try {
        return (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    } catch {
        return (f: any) => f
    }
}

let _store: ReturnType<typeof createStore>
export const getStore = () => {
    if (_store) return _store

    const reducers = combineReducers<any>({ app: reducer, router: connectRouter(getHistory()) })
    const enhancer = compose(
        install(),
        applyMiddleware(routerMiddleware(getHistory())),
        devTools()
    )

    _store = createStore(reducers, initialState as any, enhancer)
    _store.dispatch(actions.loadToken())
    setInterval(() => _store.dispatch(actions.updateThxList()), 1000)
    return _store
}
