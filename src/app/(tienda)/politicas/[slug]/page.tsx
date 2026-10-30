import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalBlocks } from "@/components/store/legal";
import { getSettings } from "@/lib/catalog";
import { privacy, terms, withdrawal, type Block } from "@/lib/policies";
import type { SettingsRow } from "@/lib/types";

const POLICIES: Record<string, { title: string; blocks: (s: SettingsRow) => Block[] }> = {
  terminos: { title: "Términos y condiciones", blocks: terms },
  privacidad: { title: "Privacidad y tratamiento de datos", blocks: privacy },
  retracto: { title: "Derecho de retracto", blocks: withdrawal },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/politicas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return policy ? { title: policy.title, alternates: { canonical: `/politicas/${slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/politicas/[slug]">) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();
  const settings = await getSettings();
  return (
    <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 md:pt-14">
      <h1 className="type-display text-[2.25rem] sm:text-5xl">{policy.title}</h1>
      <div className="mt-10">
        <LegalBlocks blocks={policy.blocks(settings)} />
      </div>
    </main>
  );
}
