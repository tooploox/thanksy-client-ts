export const userFixture = (user = {}) => ({
    id: "U2JH4TDU1",
    name: "foo.bar",
    real_name: "Foo Bar",
    avatar_url: "https://openclipart.org/image/2400px/svg_to_png/277087/Female-Avatar-3.png",
    created_at: "2019-02-01T14:37:31.852Z",
    updated_at: "2019-02-11T19:17:51.102Z",
    ...user
})

const nmap = (length, cb) => Array.apply(null, { length }).map((_, id) => cb(id))

export const thxFixture = (thx = {}) => ({
    id: 0,
    giver: userFixture(),
    receivers: [userFixture({ name: "foo" })],
    love_count: 1,
    confetti_count: 1,
    clap_count: 2,
    wow_count: 0,
    text: ":ninja: for :chicken:",
    created_at: "2019-02-11T19:17:51.110Z",
    updated_at: "2019-02-11T19:17:51.110Z",
    popularity: 4,
    ...thx
})

export const thxListFixture = cnt =>
    nmap(cnt, tid =>
        thxFixture({
            id: tid,
            giver: userFixture({ real_name: `Giver real name ${tid}` }),
            receivers: nmap(tid + 1, rid => userFixture({ real_name: `Receiver real name ${rid}` })),
            text: `${tid + 1} x :chicken: on the wall`,
            love_count: tid,
            confetti_count: tid + 1,
            clap_count: tid + 2,
            wow_count: tid + 3
        })
    )
