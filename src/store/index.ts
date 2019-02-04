import { LoopReducer } from "redux-loop"
import { extend } from "./utils"
export { getStore } from "./init"
import { AllActions, initialState } from "./actions"
export { actions, initialState } from "./actions"

export const reducer: LoopReducer<AppState, AllActions> = (state, action: AllActions) => {
    if (!state) return initialState.app
    switch (action.type) {
        case "updateDate":
            return extend(state)({ date: new Date().toString() })
    }
    return state
}
