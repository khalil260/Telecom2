"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard/recommendation", label: "Reco Offres" },
  { href: "/dashboard/global", label: "Global" },
  { href: "/dashboard/client", label: "Client" },
  { href: "/dashboard/packages", label: "Forfaits" },
  { href: "/dashboard/revenue", label: "Revenus" },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav-inner">
        <Link className="brand-wrap" href="/" aria-label="Tunisie Telecom home">
          <Image
            src="/tunisie-telecom-logo-small.svg"
            alt="Tunisie Telecom logo"
            width={58}
            height={38}
            className="brand-logo"
            priority
          />
          <span className="brand">
            <span className="brand-title">Tunisie Telecom</span>
            <span className="brand-subtitle">PFE Data Cockpit</span>
          </span>
        </Link>

        <div className="nav-list" role="list">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isLinkActive(pathname, link.href) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}