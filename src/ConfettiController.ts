import { mapRepeat } from "./utils"

const defaultConfig = {
    angle: 90,
    spread: 75,
    startVelocity: 85,
    elementCount: 28,
    dragFriction: 0.1,
    duration: 7230,
    delay: 5,
    width: 12,
    height: 12,
    colors: ["#5afda1", "#5afda1", "#fb8bab", "#9c94e8", "#68e1ef", "f2c250", "#fe557d"],
    random: Math.random
}

export type ConfettiConfig = typeof defaultConfig

const createElement = (color: string, width: number, height: number, random: F0<number>) => {
    const e = document.createElement("div")
    e.style.backgroundColor = color
    e.style.width = `${Math.floor((random() * 100) % width) + 1}px`
    e.style.height = `${Math.floor((random() * 100) % height) + 1}px`
    e.style.position = "absolute"
    e.style.visibility = "hidden"
    return e
}

const createElements = (root: HTMLDivElement, { elementCount, width, height, colors, random }: ConfettiConfig) =>
    mapRepeat(elementCount, index => {
        const e = createElement(colors[index % colors.length], width, height, random)
        root.appendChild(e)
        return e
    })

const randomPhysics = ({ angle, spread, startVelocity, random }: ConfettiConfig) => {
    const radAngle = angle * (Math.PI / 180)
    const radSpread = spread * (Math.PI / 180)
    return {
        x: 0,
        y: 0,
        z: 0,
        opacity: 1,
        wobble: random() * 10,
        wobbleSpeed: 0.1 + random() * 0.1,
        velocity: startVelocity * 0.5 + random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
        angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
        tiltAngle: random() * Math.PI,
        tiltAngleSpeed: 0.1 + random() * 0.3
    }
}
type Physics = ReturnType<typeof randomPhysics>

const updateFetti = (fetti: Fetti, progress: number, dragFriction: number) => {
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity
    fetti.physics.wobble += fetti.physics.wobbleSpeed
    fetti.physics.velocity -= fetti.physics.velocity * dragFriction
    fetti.physics.y += 3
    fetti.physics.tiltAngle += fetti.physics.tiltAngleSpeed

    const { x, y, tiltAngle, wobble } = fetti.physics
    const wobbleX = x + 10 * Math.cos(wobble)
    const wobbleY = y + 10 * Math.sin(wobble)
    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`

    fetti.element.style.transform = transform
    fetti.element.style.visibility = "visible"
    fetti.element.style.opacity = (1 - progress).toString()
}

type Fetti = { element: HTMLDivElement; physics: Physics }
const animate = (root: HTMLElement, fettis: Fetti[], { dragFriction, duration, delay }: ConfettiConfig) => {
    let startTime: number
    const update = (time: number, res: F0) => {
        if (!startTime) startTime = time
        const elapsed = time - startTime
        const progress = startTime === time ? 0 : (time - startTime) / duration
        fettis.slice(0, Math.ceil(elapsed / delay)).forEach(f => updateFetti(f, progress, dragFriction))
        if (time - startTime < duration) requestAnimationFrame(t => update(t, res))
        else {
            fettis.filter(f => f.element.parentNode === root).forEach(f => root.removeChild(f.element))
            res()
        }
    }

    return new Promise(res => requestAnimationFrame(t => update(t, res)))
}

export const ConfettiController = (root: HTMLDivElement | null, configDelta: Partial<ConfettiConfig> = {}) => {
    if (!root) return null
    const config = { ...defaultConfig, ...configDelta }
    const fettis: Fetti[] = createElements(root, config).map(element => ({ element, physics: randomPhysics(config) }))
    return animate(root, fettis, config)
}
