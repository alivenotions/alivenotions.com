import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styles from "~/styles/index.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => {
  return { title: "bd" };
};

export default function Index() {
  return (
  <>
    <header>
      <h1>alivenotions.</h1>
    </header>
    <article>
      <p>Hi! I am <span className="bold theme">Bhavdeep Dhanjal</span>. I'm a software engineer and I like to make plans and
        write
        about them</p>
      <p>I live in <span className="theme">Stockholm, Sweden</span> currently. Feel free to write to me about anything
        (preferably over email)</p>
      <p>This is an index of various things related to me over the internet</p>

      <h2>branch out</h2>
      <ul>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:bhavdeep@hey.com"
          >
            mail
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://bhavdeep.substack.com"
          >
            blog
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/bhavdeepdhanjal"
          >
            twitter
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/alivenotions"
          >
            github
          </a>
        </li>
        <li>
          <Link prefetch="intent" to="/ett">ett</Link>
        </li>
      </ul>
    </article>
    <footer>
      the end.
    </footer>
  </>
  );
}
