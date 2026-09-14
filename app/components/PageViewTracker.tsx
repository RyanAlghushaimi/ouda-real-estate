"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const SESSION_KEY = "awda-page-view-session";

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export default function PageViewTracker() {
  useEffect(() => {
    const path = window.location.pathname;

    // لا نحسب زيارات لوحة التحكم
    if (path.startsWith("/admin")) return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return;

    const supabase = createBrowserClient(url, anonKey);

    const sessionId = getSessionId();

    void supabase.from("page_views").insert({
      path,
      session_id: sessionId,
    });
  }, []);

  return null;
}
