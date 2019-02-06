import { parseText } from "./emoji"

describe("Text parser", () => {
    describe(":emoji:", () => {
        it("Parse emoji", () => {
            expect(parseText(":foo:")).toEqual([{ type: "emoji", caption: ":foo:", url: "url" }])
            expect(parseText(":foo-:")).toEqual([{ type: "emoji", caption: ":foo-:", url: "url" }])
            expect(parseText(":+1-2:")).toEqual([{ type: "emoji", caption: ":+1-2:", url: "url" }])
        })
        it("Parse text and emoji", () => {
            expect(parseText("foo :foo:")).toEqual([
                { type: "text", caption: "foo " },
                { type: "emoji", caption: ":foo:", url: "url" }
            ])
        })
        it("Parse emoji and emoji", () => {
            expect(parseText(":foo::bar:")).toEqual([
                { type: "emoji", caption: ":foo:", url: "url" },
                { type: "emoji", caption: ":bar:", url: "url" }
            ])
        })
        it("Parse emoji text and emoji", () => {
            expect(parseText(":foo:text:bar:")).toEqual([
                { type: "emoji", caption: ":foo:", url: "url" },
                { type: "text", caption: "text" },
                { type: "emoji", caption: ":bar:", url: "url" }
            ])
        })
        it("Parse :: and emoji", () => {
            expect(parseText(":::foo:")).toEqual([
                { type: "text", caption: "::" },
                { type: "emoji", caption: ":foo:", url: "url" }
            ])
        })
    })

    describe("@nickname", () => {
        it("Parse nickname", () => {
            expect(parseText("@nick.name")).toEqual([{ type: "nickname", caption: "@nick.name" }])
        })
        it("Parse text and nickname", () => {
            expect(parseText("foo @nick")).toEqual([
                { type: "text", caption: "foo " },
                { type: "nickname", caption: "@nick" }
            ])
        })
        it("Parse nickname and nickname", () => {
            expect(parseText("@foo@bar")).toEqual([
                { type: "nickname", caption: "@foo" },
                { type: "nickname", caption: "@bar" }
            ])
        })
        it("Parse text and nick and text", () => {
            expect(parseText("@@foo:")).toEqual([
                { type: "text", caption: "@" },
                { type: "nickname", caption: "@foo" },
                { type: "text", caption: ":" }
            ])
        })
    })

    describe("@nickname and :emoji:", () => {
        it("parses @nick and :emoji:", () => {
            expect(parseText("@nick:smile:")).toEqual([
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" }
            ])
        })
        it("parses @nick and :emoji: @nick", () => {
            expect(parseText("@nick:smile:@nick")).toEqual([
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" }
            ])
        })
        it("parses :emoji: and @nick", () => {
            expect(parseText(":smile:@nick")).toEqual([
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" }
            ])
        })

        it("parses :emoji: and @nick", () => {
            expect(parseText(":smile:@nick:smile:")).toEqual([
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" }
            ])
        })
    })

    it("parse complicated case", () => {
        expect(parseText(":@foo@bar:smile::smile:how are you?:")).toEqual([
            { type: "text", caption: ":" },
            { type: "nickname", caption: "@foo" },
            { type: "nickname", caption: "@bar" },
            { type: "emoji", caption: ":smile:", url: "url" },
            { type: "emoji", caption: ":smile:", url: "url" },
            { type: "text", caption: "how are you?:" }
        ])
    })
})
