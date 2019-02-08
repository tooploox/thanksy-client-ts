module.exports = {
    entry: "src/index.tsx",
    presets: [require("poi-preset-react")(), require("poi-preset-typescript")()],
    port: 4004,
    env: {
        APP_DESCRIPTION: "thanksy app",
        API_URL: "https://thanksy.herokuapp.com"
    }
}
