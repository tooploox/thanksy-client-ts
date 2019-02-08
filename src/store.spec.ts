import { reducer, initialState, splitThxList, actions } from "./store"
import { thxFixture } from "../test/fixtures"

describe("counter state", () => {
    describe("reducer", () => {
        it("gives same state when unknown action is given", () =>
            expect(reducer(initialState.app, { type: "fake" })).toEqual(initialState.app))

        it("gives same state when unknown action is given", () => {
            const action = actions.setThxListFailed(new Error("foo"))
            const rstate: AppState = (reducer(initialState.app, action) as any)[0]
            expect(rstate).toEqual(initialState.app)
        })
    })

    describe("splitThxList()", () => {
        const t1 = thxFixture({ id: 1 })
        const t2 = thxFixture({ id: 2 })
        const t3 = thxFixture({ id: 3 })

        it("Gives only thxList when all ids are <= than lastId", () =>
            expect(splitThxList([t1, t2], 2)).toEqual({ recentThxList: [], thxList: [t1, t2] }))

        it("Gives only recentThxList when all ids are > than lastId", () =>
            expect(splitThxList([t2, t3], 1)).toEqual({ recentThxList: [t2, t3], thxList: [] }))

        it("Gives both list filtered", () =>
            expect(splitThxList([t1, t2, t3], 2)).toEqual({ recentThxList: [t3], thxList: [t1, t2] }))
    })
})
