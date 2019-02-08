import { reducer, initialState, splitThxList, actions } from "./store"
import { thxFixture } from "../test/fixtures"

describe("counter state", () => {
    describe("reducer", () => {
        it("gives same state when unknown action is given", () =>
            expect(reducer(initialState.app, { type: "fake" })).toEqual(initialState.app))

        describe("Notifications", () => {
            it("creates notification when setThxListFailed is dispatched", () => {
                const action = actions.setThxListFailed(new Error("foo"))
                const rstate: AppState = (reducer(initialState.app, action) as any)[0]
                expect(rstate.notifications.length).toEqual(1)
                expect(rstate.notifications[0].text).toEqual("foo")
            })

            it("removes notification with `id` when clearNotification is dispatched", () => {
                const n1 = { notificationId: "1", text: "foo" }
                const n2 = { notificationId: "2", text: "bar" }
                const state = { ...initialState.app, notifications: [n1, n2] }
                const action = actions.clearNotification(n1.notificationId)
                const rstate: AppState = reducer(state, action) as any
                expect(rstate.notifications).toEqual([n2])
            })
        })
    })

    describe("splitThxList()", () => {
        const t1 = thxFixture({ id: 1 })
        const t2 = thxFixture({ id: 2 })
        const t3 = thxFixture({ id: 3 })

        it("Gives only thxList when all ids are <= than lastThxId", () =>
            expect(splitThxList([t1, t2], 2)).toEqual({ recentThxList: [], thxList: [t1, t2], lastThxId: 2 }))

        it("Gives only recentThxList when all ids are > than lastThxId", () =>
            expect(splitThxList([t2, t3], 1)).toEqual({ recentThxList: [t2, t3], thxList: [], lastThxId: 1 }))

        it("Gives both list filtered", () =>
            expect(splitThxList([t1, t2, t3], 2)).toEqual({ recentThxList: [t3], thxList: [t1, t2], lastThxId: 2 }))
    })
})
