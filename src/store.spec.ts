import { reducer, initialState, splitThxList } from "./store"
import { thxFixture } from "../test/fixtures"

describe("counter state", () => {
    describe("reducer", () => {
        it("gives same state when unknown action is given", () =>
            expect(reducer(initialState.app, { type: "fake" })).toEqual(initialState.app))
    })
    describe("splitThxList()", () => {
        const t1 = thxFixture({ id: 1 })
        const t2 = thxFixture({ id: 2 })
        const t3 = thxFixture({ id: 3 })

        it("Gives only thxList when all ids are <= than lastId", () => {
            const ts = [t1, t2]
            expect(splitThxList(ts, 2)).toEqual({ recentThxList: [], thxList: ts })
        })

        it("Gives only recentThxList when all ids are > than lastId", () => {
            const ts = [t2, t3]
            expect(splitThxList(ts, 1)).toEqual({ recentThxList: ts, thxList: [] })
        })
    })
})
