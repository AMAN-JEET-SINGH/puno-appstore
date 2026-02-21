import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="wrap navbar-inner">
        <Link href="/" className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="8" width="28" height="22" rx="3" fill="#5b8def" opacity="0.15"/>
            <rect x="4" y="6" width="24" height="20" rx="3" fill="#5b8def" opacity="0.3"/>
            <rect x="6" y="4" width="20" height="18" rx="3" fill="#5b8def"/>
            <path d="M13 9l7 4-7 4V9z" fill="white"/>
          </svg>
          <span>puno<span className="gold">appstore</span></span>
        </Link>
        <div className="navbar-links">
          <Link href="/apps">Apps</Link>
          <Link href="/games">Games</Link>
        </div>
      </div>
    </nav>
  );
}
