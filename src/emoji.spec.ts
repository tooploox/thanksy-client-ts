import { parseText, Text, Emoji, Nickname } from "./emoji"

describe("Text parser", () => {
    it("Emoji constructor", () => {
        expect(Emoji("caption")).toEqual({ type: "emoji", caption: "caption", url: "" })
        expect(Emoji("caption", "url")).toEqual({ type: "emoji", caption: "caption", url: "url" })
    })

    it("Text constructor", () => expect(Text("caption")).toEqual({ type: "text", caption: "caption" }))

    it("Nickname constructor", () => expect(Nickname("@caption")).toEqual({ type: "nickname", caption: "@caption" }))

    describe(":emoji:", () => {
        it("Parse emoji", () => {
            expect(parseText(":foo:")).toEqual([Emoji(":foo:")])
            expect(parseText(":foo-:")).toEqual([Emoji(":foo-:")])
            expect(parseText(":+1-2:")).toEqual([Emoji(":+1-2:")])
        })
        it("Parse text and emoji", () => expect(parseText("foo :foo:")).toEqual([Text("foo "), Emoji(":foo:")]))
        it("Parse emoji and emoji", () => expect(parseText(":foo::bar:")).toEqual([Emoji(":foo:"), Emoji(":bar:")]))
        it("Parse emoji text and emoji", () =>
            expect(parseText(":foo:text:bar:")).toEqual([Emoji(":foo:"), Text("text"), Emoji(":bar:")]))
        it("Parse :: and emoji", () => expect(parseText(":::foo:")).toEqual([Text("::"), Emoji(":foo:")]))
    })

    describe("@nickname", () => {
        it("Parse nickname", () => expect(parseText("@nick.name")).toEqual([Nickname("@nick.name")]))
        it("Parse text and nickname", () => expect(parseText("foo @nick")).toEqual([Text("foo "), Nickname("@nick")]))
        it("Parse nickname and nickname", () =>
            expect(parseText("@foo@bar")).toEqual([Nickname("@foo"), Nickname("@bar")]))
        it("Parse text and nick and text", () =>
            expect(parseText("@@foo:")).toEqual([Text("@"), Nickname("@foo"), Text(":")]))
    })

    describe("@nickname and :emoji:", () => {
        it("parses @nick and :emoji:", () =>
            expect(parseText("@nick:smile:")).toEqual([Nickname("@nick"), Emoji(":smile:")]))
        it("parses @nick and :emoji: @nick", () =>
            expect(parseText("@nick:smile:@nick")).toEqual([Nickname("@nick"), Emoji(":smile:"), Nickname("@nick")]))
        it("parses :emoji: and @nick", () =>
            expect(parseText(":smile:@nick")).toEqual([Emoji(":smile:"), Nickname("@nick")]))

        it("parses :emoji: and @nick", () =>
            expect(parseText(":smile:@nick:smile:")).toEqual([Emoji(":smile:"), Nickname("@nick"), Emoji(":smile:")]))
    })

    describe("parse text replacer", () => {
        it("Removes <!groups > string", () =>
            expect(parseText("<!subteam^S0JRJKY1G|@foo.bar> foo <!subteam^S0JRJKY1G|@xxx-asd>")).toEqual([
                Nickname("@foo.bar"),
                Text(" foo "),
                Nickname("@xxx-asd")
            ]))
        it("Support utf emoji", () =>
            expect(parseText("😀😂 foo")).toEqual([Emoji(":grinning:"), Emoji(":joy:"), Text(" foo")]))
    })

    it("parse complicated case", () =>
        expect(parseText(":@foo@bar:smile::smile:how are you?:")).toEqual([
            Text(":"),
            Nickname("@foo"),
            Nickname("@bar"),
            Emoji(":smile:"),
            Emoji(":smile:"),
            Text("how are you?:")
        ]))
})
