import { createAction } from "../utils/typedActions"

export const actions = {
    updateDate: () => createAction("updateDate")
}
export type AllActions = ReturnType<typeof actions[keyof typeof actions]>
export const initialState: RootState = { app: { date: "" } } as any
