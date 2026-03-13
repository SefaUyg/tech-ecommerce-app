"use client";

import { Key, X, Save, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { resetUserPasswordAction } from "./actions";

export function ResetPasswordForm({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(resetUserPasswordAction, undefined);

  return (
    <div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        onClick={() => setOpen(!open)}
      >
        <Key className="h-3 w-3" />
        Şifre Sıfırla
      </button>

      {open ? (
        <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{userEmail}</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={userId} />
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              placeholder="Yeni şifre (min. 8 karakter)"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Kaydet
            </button>
          </form>
          {state?.error ? <p className="mt-1.5 text-xs text-red-600">{state.error}</p> : null}
          {state?.ok ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-green-700">
              ✓ Şifre güncellendi.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
