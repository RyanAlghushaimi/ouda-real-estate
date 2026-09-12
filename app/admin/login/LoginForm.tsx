"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "./actions";

const initialState: SignInState = null;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-ink-soft">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-ink-soft">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
        />
      </div>

      {state && !state.ok && <p className="text-xs text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-pine px-4 py-3 text-sm text-white transition-colors hover:bg-pine-deep disabled:opacity-60"
      >
        {pending ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
