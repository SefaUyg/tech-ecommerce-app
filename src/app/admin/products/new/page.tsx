import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { requireAdmin } from "@/lib/requireAdmin";
import { ImageUploadField } from "@/components/ImageUploadField";
import { createProductAction } from "../actions";

export default async function AdminNewProductPage() {
  await requireAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Yeni Ürün</h2>
          <p className="text-sm text-slate-500">Mağazaya yeni bir ürün ekleyin.</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Geri
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action={createProductAction} className="space-y-5">
          <Field label="Başlık">
            <input
              name="title"
              required
              placeholder="Ürün adı"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </Field>
          <Field label="Açıklama">
            <textarea
              name="description"
              rows={4}
              placeholder="Ürün hakkında kısa bir açıklama..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Fiyat (kuruş)" hint="Örn: 29900 = 299,00 ₺">
              <input
                name="priceCents"
                type="number"
                min={0}
                required
                placeholder="29900"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field label="Yayın durumu">
              <select
                name="active"
                defaultValue="true"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">✅ Aktif (Yayında)</option>
                <option value="false">⏸️ Pasif (Gizli)</option>
              </select>
            </Field>
          </div>
          <Field label="Görsel (URL veya yükle)">
            <ImageUploadField name="imageUrl" />
          </Field>

          <div className="border-t border-slate-100 pt-4">
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700">
              <Save className="h-4 w-4" />
              Ürünü Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
