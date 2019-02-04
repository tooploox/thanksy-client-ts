import { parse, convert } from "./converter"

describe("Parse", () => {
    describe(":emoji:", () => {
        it("Parse emoji", () => {
            expect(parse(":foo:")).toEqual([{ type: "emoji", caption: ":foo:", url: "url" }])
            expect(parse(":foo-:")).toEqual([{ type: "emoji", caption: ":foo-:", url: "url" }])
            expect(parse(":+1-2:")).toEqual([{ type: "emoji", caption: ":+1-2:", url: "url" }])
        })
        it("Parse text and emoji", () => {
            expect(parse("foo :foo:")).toEqual([
                { type: "text", caption: "foo " },
                { type: "emoji", caption: ":foo:", url: "url" }
            ])
        })
        it("Parse emoji and emoji", () => {
            expect(parse(":foo::bar:")).toEqual([
                { type: "emoji", caption: ":foo:", url: "url" },
                { type: "emoji", caption: ":bar:", url: "url" }
            ])
        })
        it("Parse emoji text and emoji", () => {
            expect(parse(":foo:text:bar:")).toEqual([
                { type: "emoji", caption: ":foo:", url: "url" },
                { type: "text", caption: "text" },
                { type: "emoji", caption: ":bar:", url: "url" }
            ])
        })
        it("Parse :: and emoji", () => {
            expect(parse(":::foo:")).toEqual([
                { type: "text", caption: "::" },
                { type: "emoji", caption: ":foo:", url: "url" }
            ])
        })
    })

    describe("@nickname", () => {
        it("Parse nickname", () => {
            expect(parse("@nick.name")).toEqual([{ type: "nickname", caption: "@nick.name" }])
        })
        it("Parse text and nickname", () => {
            expect(parse("foo @nick")).toEqual([
                { type: "text", caption: "foo " },
                { type: "nickname", caption: "@nick" }
            ])
        })
        it("Parse nickname and nickname", () => {
            expect(parse("@foo@bar")).toEqual([
                { type: "nickname", caption: "@foo" },
                { type: "nickname", caption: "@bar" }
            ])
        })
        it("Parse text and nick and text", () => {
            expect(parse("@@foo:")).toEqual([
                { type: "text", caption: "@" },
                { type: "nickname", caption: "@foo" },
                { type: "text", caption: ":" }
            ])
        })
    })

    describe("@nickname and :emoji:", () => {
        it("parses @nick and :emoji:", () => {
            expect(parse("@nick:smile:")).toEqual([
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" }
            ])
        })
        it("parses @nick and :emoji: @nick", () => {
            expect(parse("@nick:smile:@nick")).toEqual([
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" }
            ])
        })
        it("parses :emoji: and @nick", () => {
            expect(parse(":smile:@nick")).toEqual([
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" }
            ])
        })

        it("parses :emoji: and @nick", () => {
            expect(parse(":smile:@nick:smile:")).toEqual([
                { type: "emoji", caption: ":smile:", url: "url" },
                { type: "nickname", caption: "@nick" },
                { type: "emoji", caption: ":smile:", url: "url" }
            ])
        })
    })
    it("parse complicated case", () => {
        expect(parse(":@foo@bar:smile::smile:how are you?:")).toEqual([
            { type: "text", caption: ":" },
            { type: "nickname", caption: "@foo" },
            { type: "nickname", caption: "@bar" },
            { type: "emoji", caption: ":smile:", url: "url" },
            { type: "emoji", caption: ":smile:", url: "url" },
            { type: "text", caption: "how are you?:" }
        ])
    })
})

describe("coverstion", () => {
    it("converts invalid data into nothing", () => {
        expect(convert(null as any)).toEqual({ type: "nothing" })
        expect(convert({} as any)).toEqual({ type: "nothing" })
        expect(convert({ id: "1" } as any)).toEqual({ type: "nothing" })
    })

    it("converts invalid data into nothing", () => {
        const payload: any = {
            id: 54,
            giver: {
                id: "UA87B9X9C",
                name: "pawel.janka",
                real_name: "Pawel.Janka",
                avatar_url: "https://avatars.slack-edge.com/2019-01-06/517619831413_65485c4235f8961cee0c_72.png",
                created_at: "2019-02-01T12:09:05.517Z",
                updated_at: "2019-02-01T12:09:05.517Z"
            },
            receivers: [],
            love_count: 0,
            confetti_count: 0,
            clap_count: 0,
            wow_count: 0,
            text: "@user love to work with @user2 :joy:",
            created_at: "2019-02-04T16:54:48.938Z",
            updated_at: "2019-02-04T16:54:48.938Z",
            popularity: 0
        }
        const expectedText: TextChunk[] = [
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
        expect((convert(payload) as any).value.text).toEqual(expectedText)
    })
})
