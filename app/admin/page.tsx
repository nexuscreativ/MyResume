import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readSite, persistenceMode } from "@/lib/database";
import EditForm from "./_components/EditForm";

export const metadata = {
  title: "Admin · Edit",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const site = await readSite();
  const mode = persistenceMode();
  return <EditForm initial={site} mode={mode} />;
}
