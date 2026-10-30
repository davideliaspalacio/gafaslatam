import type { Block } from "@/lib/policies";

export function LegalBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((b, i) => (
        <section key={i}>
          {b.h ? <h2 className="type-display text-[1.4rem] sm:text-2xl">{b.h}</h2> : null}
          {b.p.map((p) => (
            <p key={p} className="mt-3 max-w-[36rem] leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
