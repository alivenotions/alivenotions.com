import type { MetaFunction } from "remix";
import styles from "~/styles/sounds.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => {
  return { title: "sounds" };
};

const sounds = [
  { title: '', src: '', subtitle: '' },
]
export default function Index() {
  return (
    <>
      <img src="/guitar.svg" alt="" />
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
    </>
  )
}
