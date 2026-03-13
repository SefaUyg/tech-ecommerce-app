import { redirect } from "next/navigation";
import { getSession } from "./auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");
  return session;
}

