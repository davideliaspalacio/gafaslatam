import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { Loading, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { wompiConfigured } from "@/lib/wompi";

export const metadata = { title: "Ajustes" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Ajustes" />
      <Suspense fallback={<Loading />}>
        <Settings />
      </Suspense>
    </>
  );
}

async function Settings() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();
  if (!data) return <p className="text-sm text-alert">No se encontraron los ajustes. Corre pnpm db:reset.</p>;
  return <SettingsForm settings={data} wompiReady={wompiConfigured()} />;
}
