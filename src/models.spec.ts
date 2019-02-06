import { validateUser, validateThx, validateThxList } from "./models"
import { Nickname, Text, Emoji } from "./emoji"
import { userFixture, serverThxFixture } from "../test/fixtures"

describe("models", () => {
    describe("User", () => {
        it("returns Err when invalid user is given", () => {
            expect(validateUser(null).type).toEqual("Err")
            expect(validateUser({}).type).toEqual("Err")
            expect(validateUser({ id: "1" }).type).toEqual("Err")
        })
        it("returns converted user when valid data is given", () => {
            const value = userFixture()
            const expectedResult = { type: "Ok", value }
            expect(validateUser(value)).toEqual(expectedResult)
        })
    })

    describe("Thx", () => {
        it("returns Err when invalid user is given", () => {
            expect(validateThx(null).type).toEqual("Err")
            expect(validateThx({}).type).toEqual("Err")
            expect(validateThx({ id: "1" }).type).toEqual("Err")
        })

        it("gives converted thx numeric values", () => {
            const t = serverThxFixture({ id: 0, love_count: 1, confetti_count: 2, clap_count: 3, wow_count: 4 })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.id).toEqual(0)
            expect(result.value.loveCount).toEqual(1)
            expect(result.value.confettiCount).toEqual(2)
            expect(result.value.clapCount).toEqual(3)
            expect(result.value.wowCount).toEqual(4)
        })

        it("gives converted giver", () => {
            const giver = userFixture()
            const t = serverThxFixture({ giver })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.giver).toEqual(giver)
        })

        it("gives converted receivers", () => {
            const receivers = [userFixture({ id: "1" }), userFixture({ id: "2" })]
            const t = serverThxFixture({ receivers })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.receivers).toEqual(receivers)
        })

        it("gives converted time", () => {
            const t = serverThxFixture({ created_at: "2019-02-01T10:08:53.282Z" })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.createdAt).toMatch(/.*08 AM/)
        })

        it("gives parsed text", () => {
            const t = serverThxFixture({ text: "@user loves @user2 :joy:" })
            const result: Ok<Thx> = validateThx(t) as any
            const chunks = [Nickname("@user"), Text(" loves "), Nickname("@user2"), Text(" "), Emoji(":joy:")]
            expect(result.type).toEqual("Ok")
            expect(result.value.chunks).toEqual(chunks)
        })
    })

    describe("Thx List", () => {
        it("gives parsed array", () => {
            const t1 = serverThxFixture({ id: 1 })
            const t2 = serverThxFixture({ id: 2 })
            const current: Ok<Thx[]> = validateThxList([t1, t2]) as any
            expect(current.type).toEqual("Ok")
            expect(current.value[0].id).toEqual(1)
            expect(current.value[1].id).toEqual(2)
        })
    })
})
