export const fixtureFactory = <T>(defaults: T) => (params: Partial<T> = {}) =>
    (({ ...(defaults as any), ...(params as any) } as any) as T)

export const userFixture = fixtureFactory<User>({
    real_name: "real name",
    id: "id",
    name: "name",
    avatar_url: "https://media.cargocollective.com/1/0/21154/headerimg/avatar_animation_twitter5.png"
})

export const serverThxFixture = fixtureFactory<ServerThx>({
    giver: userFixture({ name: "giver" }),
    receivers: [userFixture({ name: "receiver 1" })],
    id: 0,
    love_count: 1,
    confetti_count: 2,
    clap_count: 3,
    wow_count: 4,
    text: "@offhub for great iOS experience :)",
    created_at: "2019-02-06T11:18:18.321Z"
})

export const thxFixture = fixtureFactory<Thx>({
    giver: userFixture({ name: "giver" }),
    receivers: [userFixture({ name: "receiver 1" })],
    id: 0,
    loveCount: 1,
    confettiCount: 2,
    clapCount: 3,
    wowCount: 4,
    chunks: [{ caption: "test", type: "text" }],
    createdAt: "Today at 10:55"
})
