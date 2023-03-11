import { MetaFunction } from "@remix-run/node"

export const handle = { hydrate: false }

import styles from "~/styles/rush.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => {
  return { title: "rush." };
}
export default function Rush() {
  return (
    <>
      <header><h1>Rush</h1></header>
      <p>It is a browser.</p>

      <main>
        <h2>What are we doing and why another browser?</h2>
      </main>
    </>
  )
}
