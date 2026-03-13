import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ImageUploadField } from "@/components/ImageUploadField";
import { ToastOnMount } from "@/components/ToastOnMount";
import { deleteProductAction, updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { success } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, title: true, description: true, priceCents: true, imageUrl: true, active: true },
  });
  if (!product) notFound();

  return (
    <div>
      {success === "created" ? <ToastOnMount type="created" /> : null}
      {success === "updated" ? <ToastOnMount type="updated" /> : null}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Ürün Düzenle</h2>
          <p className="text-sm text-slate-500">Ürün bilgilerini güncelleyin.</p>
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
        <form action={updateProductAction.bind(null, product.id)} className="space-y-5">
          <Field label="Başlık">
            <input
              name="title"
              required
              defaultValue={product.title}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </Field>
          <Field label="Açıklama">
            <textarea
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
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
                defaultValue={product.priceCents}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
            <Field label="Yayın durumu">
              <select
                name="active"
                defaultValue={product.active ? "true" : "false"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">✅ Aktif (Yayında)</option>
                <option value="false">⏸️ Pasif (Gizli)</option>
              </select>
            </Field>
          </div>
          <Field label="Görsel (URL veya yükle)">
            <ImageUploadField name="imageUrl" defaultValue={product.imageUrl ?? ""} />
          </Field>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700">
              <Save className="h-4 w-4" />
              Kaydet
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <p className="mb-3 text-sm font-medium text-red-700">Tehlikeli Alan</p>
        <form action={deleteProductAction.bind(null, product.id)}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            Ürünü Kalıcı Sil
          </button>
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
