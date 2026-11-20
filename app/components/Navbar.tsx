"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Create Test Cases",
    href: "/",
  },
  {
    name: "Create POM",
    href: "/pom",
  },
  {
    name: "Create Steps",
    href: "/steps",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        {/* LOGO */}

        <Link
          href="/"
          className="text-xl font-bold text-gray-900"
        >
          AI QA Studio
        </Link>

        {/* NAVIGATION */}

        <nav className="flex items-center gap-2">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}