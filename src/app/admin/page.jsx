import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/blog");
  } else {
    redirect("/admin/login");
  }
}
