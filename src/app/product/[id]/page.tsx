import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      priceCents: true,
      imageUrl: true,
      active: true,
    },
  });

  if (!product || !product.active) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="flex items-center gap-1 transition hover:text-indigo-600">
          <ChevronLeft className="h-4 w-4" />
          Ürünler
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover aspect-square"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 text-slate-400">
              <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <span className="text-sm">Görsel yok</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{product.title}</h1>

            <div className="mt-2 flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              ))}
              <span className="ml-1 text-sm text-slate-500">(4.0 / 5) · 12 değerlendirme</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-indigo-600">
              {(product.priceCents / 100).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              Stokta Var
            </span>
          </div>

          {product.description ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 border-t border-slate-100 pt-4">
              {product.description}
            </p>
          ) : null}

          <div className="mt-2">
            <AddToCartButton productId={product.id} title={product.title} />
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
            <div className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center">
              <Truck className="h-5 w-5 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Ücretsiz Kargo</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Güvenli Ödeme</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center">
              <RotateCcw className="h-5 w-5 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Kolay İade</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
