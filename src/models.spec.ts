import { validateUser, validateThx } from "./models"
import { userFixture, thxFixture } from "../test/fixtures"

describe("models", () => {
    describe("User", () => {
        it("returns Err when invalid user is given", () => {
            expect(validateUser(null).type).toEqual("Err")
            expect(validateUser({}).type).toEqual("Err")
            expect(validateUser({ id: "1" }).type).toEqual("Err")
        })
        it("returns converted user when valid data is given", () => {
            const u = userFixture()
            const expectedResult = { type: "Ok", value: u }
            expect(validateUser(u)).toEqual(expectedResult)
        })
    })

    describe("Thx", () => {
        it("returns Err when invalid user is given", () => {
            expect(validateThx(null).type).toEqual("Err")
            expect(validateThx({}).type).toEqual("Err")
            expect(validateThx({ id: "1" }).type).toEqual("Err")
        })

        it("gives converted thx numeric values", () => {
            const t = thxFixture({ id: 0, love_count: 1, confetti_count: 2, clap_count: 3, wow_count: 4 })
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
            const t = thxFixture({ giver })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.giver).toEqual(giver)
        })

        it("gives converted receivers", () => {
            const receivers = [userFixture({ id: "1" }), userFixture({ id: "2" })]
            const t = thxFixture({ receivers })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.receivers).toEqual(receivers)
        })

        it("gives converted time", () => {
            const t = thxFixture({ created_at: "2019-02-01T10:08:53.282Z" })
            const result: Ok<Thx> = validateThx(t) as any
            expect(result.type).toEqual("Ok")
            expect(result.value.time).toMatch(/.*08 AM/)
        })

        it("gives parsed text", () => {
            const t = thxFixture({ text: "@user love to work with @user2 :joy:" })
            const result: Ok<Thx> = validateThx(t) as any
            const chunks: TextChunk[] = [
                {
                    type: "nickname",
                    caption: "@user"
                },
                {
                    type: "text",
                    caption: " love to work with "
                },
                { caption: "@user2", type: "nickname" },
                { caption: " ", type: "text" },
                {
                    caption: ":joy:",
                    type: "emoji",
                    url: "url"
                }
            ]
            expect(result.type).toEqual("Ok")
            expect(result.value.chunks).toEqual(chunks)
        })
    })
})
