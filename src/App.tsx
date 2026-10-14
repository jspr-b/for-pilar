import { useEffect, useMemo, useRef, useState } from "react";

// Everything personal lives here. Lists left empty are simply not shown.
const PERSONAL = {
  name: "Pilar",
  from: "you know who 😉",
  letter: [
    "Hey Pilar,",
    "I wanted to ask you something, Pilar, and a text just didn't feel like enough.",
    "So I made this. Just for you, Pilar.",
    "Take your time, Pilar. (But there's really only one right answer.)",
  ],
  // Things you love about her, e.g. "Your laugh when you're trying not to laugh"
  reasons: [] as string[],
  // Shown after she says yes
  plan: [
    "First matcha frostie is on me, Pilar 🍵",
    "Chocolate cake on top, as promised 🍫",
    "Pilar + me = best date ever 💞",
  ],
};

const NO_PHRASES = [
  "No",
  "Are you sure?",
  "What if I asked really nicely Pilar?",
  "Please",
  "With a chocolate cake on top",
  "What about a matcha frostie",
  "PLEASE POOKIE",
  "But :*(",
  "I am going to die",
  "Yep im dead",
  ":((((",
  "PRETTY PLEASE",
  "No :(",
];

// After this many "no"s the button starts running away
const DODGE_AFTER = 4;

type Stage = "envelope" | "letter" | "question" | "yes";

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: window.innerWidth < 640 ? 12 : 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        duration: 9 + Math.random() * 10,
        delay: Math.random() * 12,
        emoji: ["💗", "Pilar", "💖", "🌸", "Pilar 💕"][i % 5],
      })),
    [],
  );
  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart font-script font-bold text-pink-500"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </>
  );
}

function HeartBurst() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const reach = Math.min(window.innerWidth, window.innerHeight) / 2;
        const dist = reach * (0.5 + Math.random() * 0.6);
        return {
          id: i,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          size: 18 + Math.random() * 22,
          delay: Math.random() * 0.3,
        };
      }),
    [],
  );
  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="burst-heart"
          style={
            {
              "--dx": h.dx,
              "--dy": h.dy,
              fontSize: h.size,
              animationDelay: `${h.delay}s`,
            } as React.CSSProperties
          }
        >
          💖
        </span>
      ))}
    </>
  );
}

function Letter({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const lines = PERSONAL.letter;

  useEffect(() => {
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown(shown + 1), shown === 0 ? 300 : 1600);
    return () => clearTimeout(t);
  }, [shown, lines.length]);

  return (
    <div className="card fade-in w-full max-w-md p-6 text-left sm:p-8">
      {lines.slice(0, shown).map((line, i) => (
        <p
          key={i}
          className={`fade-in mb-4 text-lg ${i === 0 ? "font-script text-3xl" : ""}`}
        >
          {line}
        </p>
      ))}
      {shown >= lines.length && (
        <div className="fade-in">
          <p className="font-script mb-6 text-right text-2xl">— {PERSONAL.from}</p>
          <button
            onClick={onDone}
            className="tap w-full rounded-full bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-pink-600"
          >
            Okay, I'm ready ✨
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [stage, setStage] = useState<Stage>("envelope");
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const isPhone = window.innerWidth < 640;
  const yesButtonSize = Math.min(noCount * (isPhone ? 8 : 14) + 20, isPhone ? 64 : 120);
  const noText = NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];

  const dodge = () => {
    if (noCount < DODGE_AFTER) return;
    const margin = 16;
    const w = noRef.current?.offsetWidth ?? 120;
    const h = noRef.current?.offsetHeight ?? 48;
    setNoPos({
      x: margin + Math.random() * Math.max(0, window.innerWidth - w - margin * 2),
      y: margin + Math.random() * Math.max(0, window.innerHeight - h - margin * 2),
    });
  };

  const handleNo = () => {
    setNoCount(noCount + 1);
    dodge();
  };

  return (
    <div className="safe relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-10 text-center">
      <FloatingHearts />
      {stage === "yes" && <HeartBurst />}

      <div className="relative z-10 flex w-full flex-col items-center">
        {stage === "envelope" && (
          <button
            onClick={() => setStage("letter")}
            className="tap fade-in flex flex-col items-center"
          >
            <span className="envelope text-[110px] leading-none sm:text-[140px]">💌</span>
            <span className="font-script mt-6 text-4xl sm:text-5xl">
              {PERSONAL.name}, you've got mail
            </span>
            <span className="mt-3 text-sm opacity-70">tap to open</span>
          </button>
        )}

        {stage === "letter" && <Letter onDone={() => setStage("question")} />}

        {stage === "question" && (
          <div className="fade-in flex flex-col items-center">
            <img
              className="h-[160px] max-w-full drop-shadow-lg sm:h-[200px]"
              src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
              alt="A bear holding roses"
            />
            <h1 className="font-script my-5 text-[2.6rem] leading-tight sm:text-6xl">
              Will you go out with me {PERSONAL.name}?
            </h1>

            {PERSONAL.reasons.length > 0 && (
              <ul className="card mb-6 max-w-md space-y-2 p-5 text-left">
                {PERSONAL.reasons.map((r) => (
                  <li key={r}>💗 {r}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="tap rounded-full bg-pink-500 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-pink-600"
                style={{ fontSize: yesButtonSize }}
                onClick={() => setStage("yes")}
              >
                Yes
              </button>
              <button
                ref={noRef}
                onClick={handleNo}
                onMouseEnter={dodge}
                className="tap max-w-[80vw] rounded-full bg-white/80 px-5 py-3 font-bold text-pink-700 shadow transition-all duration-200 hover:bg-white"
                style={
                  noPos
                    ? { position: "fixed", left: noPos.x, top: noPos.y, zIndex: 20 }
                    : undefined
                }
              >
                {noText}
              </button>
            </div>
            {noCount > 0 && (
              <p className="mt-6 text-sm opacity-60">
                Pilar's "no" count: {noCount} (the Yes button is getting impatient)
              </p>
            )}
          </div>
        )}

        {stage === "yes" && (
          <div className="fade-in flex flex-col items-center">
            <img
              className="h-[180px] max-w-full sm:h-[220px]"
              src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
              alt="Two bears kissing"
            />
            <div className="my-4 text-3xl font-bold sm:text-4xl">WOOOOOO!!!!! ;))</div>
            <div className="mb-2 text-3xl font-bold uppercase tracking-wide sm:text-5xl">
              {PERSONAL.name} said yes!!! 💖
            </div>
            <p className="font-script mb-6 text-[2.4rem] leading-tight sm:text-5xl">
              It's a date, {PERSONAL.name} ❤️
            </p>
            {PERSONAL.plan.length > 0 && (
              <div className="card w-full max-w-md space-y-2 p-5 text-lg sm:p-6">
                {PERSONAL.plan.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
            <p className="font-script mt-6 text-2xl">— {PERSONAL.from}</p>
            {noCount > 0 && (
              <p className="mt-4 text-sm opacity-60">
                (it only took {PERSONAL.name} {noCount} "no"{noCount === 1 ? "" : "s"} 😌)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
