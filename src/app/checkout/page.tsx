import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/checkout");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Ödeme</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Siparişinizi onaylayın. (Bu örnekte gerçek ödeme altyapısı yok.)
      </p>
      <CheckoutClient />
    </main>
  );
}
