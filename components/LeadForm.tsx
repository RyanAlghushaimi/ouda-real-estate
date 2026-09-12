"use client";

import { useActionState } from "react";
import { submitLeadAction } from "@/app/actions/leads";
import type { CreateLeadResult } from "@/lib/data/properties";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

const initialState: CreateLeadResult | null = null;

export default function LeadForm({ propertyId, locale = "ar" }: { propertyId: string; locale?: Locale }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);

  if (state?.ok) {
    return (
      <div className="mt-6 rounded-xl border border-line bg-card px-4 py-5 text-center">
        <p className="text-sm text-ink">{t(locale, "lead_success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-3 border-t border-line pt-6">
      <input type="hidden" name="propertyId" value={propertyId} />
      <p className="text-sm text-ink-soft">{t(locale, "lead_prompt")}</p>

      <input
        type="text"
        name="name"
        required
        minLength={2}
        placeholder={t(locale, "lead_name")}
        className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm placeholder:text-ink-faint"
      />
      <input
        type="tel"
        name="phone"
        required
        placeholder={t(locale, "lead_phone")}
        className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm placeholder:text-ink-faint"
      />

      {state && !state.ok && (
        <p className="text-xs text-danger">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-4 py-2.5 text-sm text-white transition-colors hover:bg-pine disabled:opacity-60"
      >
        {pending ? t(locale, "lead_submitting") : t(locale, "lead_submit")}
      </button>
    </form>
  );
}
