import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="8" width="28" height="22" rx="3" fill="#5b8def" opacity="0.15"/>
              <rect x="4" y="6" width="24" height="20" rx="3" fill="#5b8def" opacity="0.3"/>
              <rect x="6" y="4" width="20" height="18" rx="3" fill="#5b8def"/>
              <path d="M13 9l7 4-7 4V9z" fill="white"/>
            </svg>
            <span>puno<span className="gold">appstore</span></span>
          </div>
          <div className="footer-links">
            <Link href="/apps">Apps</Link>
            <Link href="/games">Games</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-disclaimer">Disclaimer: All app names, logos, and brands are property of their respective owners. PunoAppStore does not host any APK files. Download links redirect to the official Google Play Store.</p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} PunoAppStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
