// Typescript version of https://github.com/daniel-lundin/dom-confetti

import { mapRepeat } from "./utils"

const defaultConfig = {
    angle: 90,
    spread: 100,
    startVelocity: 92,
    elementCount: 40,
    dragFriction: 0.1,
    duration: 3200,
    delay: 5,
    width: 32,
    height: 32,
    colors: ["#5afda1", "#5afda1", "#fb8bab", "#9c94e8", "#68e1ef", "f2c250", "#fe557d"],
    random: Math.random
}

export type ConfettiConfig = typeof defaultConfig
type Physics = ReturnType<typeof randomPhysics>
type Particle = { element: HTMLDivElement; physics: Physics }

const createElement = (color: string, { width, random }: ConfettiConfig) => {
    const e = document.createElement("div")
    // e.style.border = `3px solid ${color}`
    if (random() - 0.5 > 0) e.style.borderRadius = "50%"
    e.style.backgroundColor = color
    e.style.width = `${Math.floor((random() * 100) % width) + 4}px`
    e.style.height = e.style.width // `${Math.floor((random() * 100) % height) + 1}px`
    e.style.position = "absolute"
    e.style.visibility = "hidden"
    return e
}

const createElements = (root: HTMLDivElement, config: ConfettiConfig) =>
    mapRepeat(config.elementCount, index => {
        const e = createElement(config.colors[index % config.colors.length], config)
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

const updateFetti = (fetti: Particle, progress: number, dragFriction: number) => {
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

const animate = (root: HTMLElement, particles: Particle[], { dragFriction, duration, delay }: ConfettiConfig) => {
    let startTime: number
    const update = (time: number, res: F0) => {
        if (!startTime) startTime = time
        const elapsed = time - startTime
        const progress = startTime === time ? 0 : (time - startTime) / duration
        particles.slice(0, Math.ceil(elapsed / delay)).forEach(f => updateFetti(f, progress, dragFriction))
        if (time - startTime < duration) requestAnimationFrame(t => update(t, res))
        else {
            particles.filter(f => f.element.parentNode === root).forEach(f => root.removeChild(f.element))
            res()
        }
    }

    return new Promise(res => requestAnimationFrame(t => update(t, res)))
}

export const ConfettiController = (root: HTMLDivElement | null, configDelta: Partial<ConfettiConfig> = {}) => {
    if (!root) return null
    const config = { ...defaultConfig, ...configDelta }
    const particles: Particle[] = createElements(root, config).map(element => ({
        element,
        physics: randomPhysics(config)
    }))
    return animate(root, particles, config)
}
