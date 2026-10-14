import { redirect } from "next/navigation";
import { getEditorialState } from "@/lib/auth/editor";

export async function EditorialFormGuard({ children }: { children: React.ReactNode }) {
  const editorial = await getEditorialState();
  if (editorial.state !== "authorized") redirect("/admin/login");
  if (editorial.role === "reviewer") {
    return <p className="mx-auto max-w-3xl px-4 py-12">Role reviewer tidak memiliki izin membuat draft.</p>;
  }
  return children;
}
