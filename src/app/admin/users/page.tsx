import { Users, Shield, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kullanıcılar</h2>
          <p className="text-sm text-slate-500">{users.length} kullanıcı</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">Kullanıcı yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white ${u.role === "ADMIN" ? "bg-indigo-600" : "bg-slate-400"}`}>
                  {u.role === "ADMIN"
                    ? <Shield className="h-4 w-4" />
                    : <User className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-slate-800">{u.email}</p>
                  <p className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.role === "ADMIN" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                  {u.role === "ADMIN" ? "Admin" : "Kullanıcı"}
                </span>
                <ResetPasswordForm userId={u.id} userEmail={u.email} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
