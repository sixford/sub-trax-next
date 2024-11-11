import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/"><a>Home</a></Link>
          </li>
          <li>
            <Link href="/subscriptions"><a>Subscriptions</a></Link>
          </li>
          <li>
            <Link href="/profile"><a>Profile</a></Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;