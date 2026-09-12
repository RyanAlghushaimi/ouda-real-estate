"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      title={dark ? "الوضع النهاري" : "الوضع الليلي"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line/70 bg-bg text-ink transition-colors hover:bg-surface"
    >
      {dark ? (
        <span aria-hidden="true" className="text-lg">
          ☀️
        </span>
      ) : (
        <span aria-hidden="true" className="text-lg">
          🌙
        </span>
      )}
    </button>
  );
}
