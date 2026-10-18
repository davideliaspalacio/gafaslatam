// Fecha estampada de cámara desechable, dibujada en siete segmentos.
// Acepta dígitos, espacios y apóstrofo: "'26 10 18".

const T = 2.2; // grosor del segmento
const CELL = 12;
const GAP = 1.6;

const h = (x: number, y: number, len: number) =>
  [
    [x, y],
    [x + T / 2, y - T / 2],
    [x + len - T / 2, y - T / 2],
    [x + len, y],
    [x + len - T / 2, y + T / 2],
    [x + T / 2, y + T / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");

const v = (x: number, y: number, len: number) =>
  [
    [x, y],
    [x + T / 2, y + T / 2],
    [x + T / 2, y + len - T / 2],
    [x, y + len],
    [x - T / 2, y + len - T / 2],
    [x - T / 2, y + T / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");

const SEGMENTS: Record<string, string> = {
  a: h(1.8, 1.2, 8),
  g: h(1.8, 10, 8),
  d: h(1.8, 18.8, 8),
  f: v(1.2, 1.8, 7.6),
  b: v(10.4, 1.8, 7.6),
  e: v(1.2, 10.6, 7.6),
  c: v(10.4, 10.6, 7.6),
};

const DIGITS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcfgd",
};

export function DateStamp({ value, className = "" }: { value: string; className?: string }) {
  let x = 0;
  const glyphs: React.ReactNode[] = [];
  [...value].forEach((ch, i) => {
    if (ch === " ") {
      x += 6;
      return;
    }
    if (ch === "'") {
      glyphs.push(<polygon key={i} points={v(x + 2, 1.6, 4.4)} />);
      x += 5;
      return;
    }
    const segs = DIGITS[ch];
    if (!segs) return;
    glyphs.push(
      <g key={i} transform={`translate(${x} 0)`}>
        {[...segs].map((s) => (
          <polygon key={s} points={SEGMENTS[s]} />
        ))}
      </g>,
    );
    x += CELL + GAP;
  });

  return (
    <svg
      viewBox={`-2 -1 ${x + 4} 22`}
      className={`fill-stamp [filter:drop-shadow(0_0_1.5px_rgb(255_107_26/0.85))_drop-shadow(0_0_5px_rgb(255_120_40/0.45))] ${className}`}
      role="img"
      aria-label={`Fecha ${value.replace("'", "20")}`}
    >
      <g transform="skewX(-8) translate(2 0)">{glyphs}</g>
    </svg>
  );
}
