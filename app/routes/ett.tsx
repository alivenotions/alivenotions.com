import React, { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'
import { useLoaderData } from "@remix-run/react";
import { MetaFunction, LoaderFunction } from "@remix-run/node"
import styles from "~/styles/ett.css"

export function links() {
  return [
    {
      rel: "preload",
      href: "/flowers.jpg",
      as: "image",
    },
    {
      rel: "preload",
      href: "/repetition.jpg",
      as: "image",
    },
    {
      rel: "preload",
      href: "/anxiety.jpg",
      as: "image",
    },
    {
      rel: "preload",
      href: "/empty.jpg",
      as: "image",
    },
    { rel: "stylesheet", href: styles }
  ]
}

export const meta: MetaFunction = () => {
  return { title: "ett." };
}

export const handle = { hydrate: true }

const useGesture = createUseGesture([dragAction, pinchAction])

type Data = { numbers: number[], cards: string[] }
export const loader: LoaderFunction = async () => {
  const cards = ['/flowers.jpg','repetition.jpg', 'anxiety.jpg', '/empty.jpg', ]
  const numbers = new Array(cards.length).fill(0).map(_ => getRandomRange(-17, 17))
  return { numbers, cards };
}

export default function Index() {
  const { numbers, cards } = useLoaderData<Data>()

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', handler)
    document.addEventListener('gesturechange', handler)
    document.addEventListener('gestureend', handler)
    return () => {
      document.removeEventListener('gesturestart', handler)
      document.removeEventListener('gesturechange', handler)
      document.removeEventListener('gestureend', handler)
    }
  }, [])

  return (
    <div className={`flex fill center container`}>
      {cards.map((x, i) => <Card url={x} rotateZ={numbers[i]} key={i} />)}
      <p>meeting people is easy.</p>
    </div>
  )

}

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Card({ url, rotateZ }: { url: string, rotateZ: number }) {
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ,
  }))
  const ref = React.useRef<HTMLDivElement>(null)

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel()
        api.start({ x, y })
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
        if (first) {
          if (!ref.current) return
          const { width, height, x, y } = ref.current.getBoundingClientRect()
          const tx = ox - (x + width / 2)
          const ty = oy - (y + height / 2)
          memo = [style.x.get(), style.y.get(), tx, ty]
        }

        const x = memo[0] - ms * memo[2]
        const y = memo[1] - ms * memo[3]
        api.start({ scale: s, rotateZ: a, x, y })
        return memo
        }
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    }
  )

  return (
    <animated.div className={`card`} ref={ref} style={{ ...style, background: `url(${url})`, backgroundSize: 'cover' }}></animated.div>
  )
}
