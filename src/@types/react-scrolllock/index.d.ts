declare module "react-scrolllock" {
    export interface Props {
        touchScrollTarget?: HTMLElement
        accountForScrollbars?: boolean
    }
    const Component: React.FunctionComponent<Props>
    export default Component
}
