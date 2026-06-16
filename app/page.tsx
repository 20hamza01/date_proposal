"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import confetti from "canvas-confetti";
import { format, startOfDay } from "date-fns";

/* ------------------------------------------------------------------ */
/*  Placeholders (the only two filled-in values)                       */
/* ------------------------------------------------------------------ */
const HER_NAME = "Malak";
const CLOSING_LINE =
  "P.S. — There was never a chance I'd let you say no. - I love you.";

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */
const btnPrimary =
  "flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-wine px-6 text-lg font-medium text-cream shadow-lg shadow-wine/25 transition-transform active:scale-[0.98]";
const btnSecondary =
  "flex min-h-[56px] w-full items-center justify-center rounded-2xl border border-wine/30 bg-cream/70 px-6 text-lg font-medium text-wine shadow-sm transition-transform active:scale-[0.98]";

const screenVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: "easeIn" } },
};

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.65, delayChildren: 0.2 } },
};
const staggerChild: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
type Slot = "Morning" | "Midday" | "Afternoon" | "Evening";

export default function Home() {
  const [step, setStep] = useState(0);

  // answers
  const [slider, setSlider] = useState(8);
  const [snapBack, setSnapBack] = useState(false);
  const [outing, setOuting] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<Slot | null>(null);

  // step 1 sub-state
  const [isSister, setIsSister] = useState(false);

  // step 2 sub-state
  const [subStep, setSubStep] = useState(0);
  const [q3Flash, setQ3Flash] = useState(false);

  return (
    <main className="relative mx-auto w-full max-w-md">
      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-10"
        >
          {step === 0 && <Greeting onAdvance={() => setStep(1)} />}

          {step === 1 && (
            <Identity
              isSister={isSister}
              onYes={() => setStep(2)}
              onSister={() => setIsSister(true)}
              onBack={() => setIsSister(false)}
            />
          )}

          {step === 2 && (
            <WarmUp
              subStep={subStep}
              setSubStep={setSubStep}
              slider={slider}
              setSlider={setSlider}
              snapBack={snapBack}
              setSnapBack={setSnapBack}
              setOuting={setOuting}
              q3Flash={q3Flash}
              onQ3={() => {
                setQ3Flash(true);
                window.setTimeout(() => setStep(3), 1200);
              }}
            />
          )}

          {step === 3 && <TheQuestion onYes={() => setStep(4)} />}

          {step === 4 && (
            <CalendarStep
              date={date}
              setDate={setDate}
              slot={slot}
              setSlot={setSlot}
              charm={slider}
              outing={outing}
              onLockIn={() => setStep(5)}
            />
          )}

          {step === 5 && date && slot && (
            <Celebration date={date} slot={slot} />
          )}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 0 — The greeting                                              */
/* ------------------------------------------------------------------ */
function Greeting({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="my-auto flex w-full flex-col items-center gap-6 text-center">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-5 text-[1.05rem] leading-relaxed text-ink"
      >
        <motion.p
          variants={staggerChild}
          className="font-serif text-2xl italic text-wine"
        >
          Ah. There you are.
        </motion.p>
        <motion.p variants={staggerChild}>
          I&rsquo;d greet you properly - a bow, a flourish, the whole
          performance you deserve - but ceremony has never been my strong suit.
          Words, on the other hand, I can manage. I&rsquo;ve always been better
          with those.
        </motion.p>
        <motion.p variants={staggerChild}>
          Consider this a trial. A pleasant one. No wrong answers - I&rsquo;ve
          seen to that - only the slow, inevitable march toward a question you
          already suspect is coming.
        </motion.p>
        <motion.p
          variants={staggerChild}
          className="font-serif text-xl italic text-wine"
        >
          Shall we begin?
        </motion.p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.6 }}
        onClick={onAdvance}
        className={btnPrimary}
      >
        We shall
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Identity check                                            */
/* ------------------------------------------------------------------ */
function Identity({
  isSister,
  onYes,
  onSister,
  onBack,
}: {
  isSister: boolean;
  onYes: () => void;
  onSister: () => void;
  onBack: () => void;
}) {
  if (isSister) {
    return (
      <div className="my-auto flex w-full flex-col items-center gap-7 text-center">
        <Card>
          <p className="font-serif text-xl italic leading-relaxed text-wine">
            A pity. She set an impossibly high bar, and you are not clearing it.
            Kindly fetch her.
          </p>
        </Card>
        <button onClick={onBack} className={btnPrimary}>
          Fine, I&rsquo;ll get her 🙄
        </button>
      </div>
    );
  }

  return (
    <div className="my-auto flex w-full flex-col items-center gap-7 text-center">
      <p className="text-[1.05rem] leading-relaxed text-ink">
        Before we proceed, a formality. I&rsquo;m legally obliged to confirm
        I&rsquo;m addressing the right woman. Lying is permitted. Flattery is
        encouraged.
      </p>
      <h2 className="font-serif text-3xl font-semibold text-wine">
        Are you {HER_NAME}?
      </h2>
      <div className="flex w-full flex-col gap-3">
        <button onClick={onYes} className={btnPrimary}>
          Yes, the one and only.
        </button>
        <button onClick={onSister} className={btnSecondary}>
          No, I&rsquo;m her cooler sister.
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — The rigged warm-up                                        */
/* ------------------------------------------------------------------ */
const OUTINGS = [
  "Brunch (he'll over-research for three days hhh)",
  "A walk where he pretends to know the way",
  "Anywhere, as long as he's talking",
  "Surprise me (he's panicking already hhh)",
];

function sliderCaption(value: number, snapBack: boolean) {
  if (snapBack)
    return "The slider, like the man, refuses to undersell himself.";
  if (value >= 10) return "Now we understand each other.";
  if (value === 9) return "Getting warmer.";
  return "Modest of you.";
}

function WarmUp({
  subStep,
  setSubStep,
  slider,
  setSlider,
  snapBack,
  setSnapBack,
  setOuting,
  q3Flash,
  onQ3,
}: {
  subStep: number;
  setSubStep: (n: number) => void;
  slider: number;
  setSlider: (n: number) => void;
  snapBack: boolean;
  setSnapBack: (b: boolean) => void;
  setOuting: (s: string) => void;
  q3Flash: boolean;
  onQ3: () => void;
}) {
  return (
    <div className="my-auto flex w-full flex-col items-center gap-8 text-center">
      <Dots total={3} active={subStep} />

      <AnimatePresence mode="wait">
        {subStep === 0 && (
          <motion.div
            key="q1"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col items-center gap-7"
          >
            <h2 className="font-serif text-2xl font-semibold leading-snug text-wine">
              On a scale of 1 to 10, how charming is the man who sent you here?
            </h2>
            <div className="font-serif text-6xl font-semibold text-wine">
              {slider}
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={slider}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < 8) {
                  setSlider(8);
                  setSnapBack(true);
                } else {
                  setSlider(v);
                  setSnapBack(false);
                }
              }}
              className="charm-slider"
              aria-label="Charm rating"
            />
            <p className="min-h-[1.5rem] text-base italic text-ink-soft">
              {sliderCaption(slider, snapBack)}
            </p>
            <button onClick={() => setSubStep(1)} className={btnPrimary}>
              Continue
            </button>
          </motion.div>
        )}

        {subStep === 1 && (
          <motion.div
            key="q2"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col items-center gap-6"
          >
            <h2 className="font-serif text-2xl font-semibold leading-snug text-wine">
              Pick the outing that sounds least offensive:
            </h2>
            <div className="flex w-full flex-col gap-3">
              {OUTINGS.map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    setOuting(o);
                    setSubStep(2);
                  }}
                  className={`${btnSecondary} text-base leading-snug`}
                >
                  {o}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {subStep === 2 && (
          <motion.div
            key="q3"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col items-center gap-7"
          >
            <h2 className="font-serif text-2xl font-semibold leading-snug text-wine">
              Quick &mdash; what&rsquo;s the correct answer to the question I
              haven&rsquo;t asked yet?
            </h2>
            <button
              onClick={onQ3}
              disabled={q3Flash}
              className={`${btnPrimary} disabled:opacity-90`}
            >
              Yes.
            </button>
            <p className="min-h-[1.5rem] text-base italic text-ink-soft">
              {q3Flash ? "Excellent instincts. Hold that thought." : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — The question with the runaway "No"                        */
/* ------------------------------------------------------------------ */
function TheQuestion({ onYes }: { onYes: () => void }) {
  const playRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [dodges, setDodges] = useState(0);

  const shrunk = dodges >= 3;
  const tiny = dodges >= 5;
  const gone = dodges >= 6;
  const yesScale = 1 + Math.min(dodges, 6) * 0.05;

  // Initial placement once the playground is measured.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const play = playRef.current;
      if (!play) return;
      const pr = play.getBoundingClientRect();
      const noW = noRef.current?.offsetWidth ?? 120;
      const noH = noRef.current?.offsetHeight ?? 52;
      setNoPos({
        x: Math.max(0, (pr.width - noW) / 2),
        y: Math.max(0, pr.height - noH - 6),
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const moveNo = useCallback(() => {
    const play = playRef.current;
    const yes = yesRef.current;
    const no = noRef.current;
    if (!play || !yes) return;

    const pr = play.getBoundingClientRect();
    const noW = no?.offsetWidth ?? 120;
    const noH = no?.offsetHeight ?? 52;
    const maxX = Math.max(0, pr.width - noW);
    const maxY = Math.max(0, pr.height - noH);

    // Forbidden zone around the Yes button (with padding).
    const yr = yes.getBoundingClientRect();
    const fx = yr.left - pr.left - 16;
    const fy = yr.top - pr.top - 16;
    const fw = yr.width + 32;
    const fh = yr.height + 32;

    let x = 0;
    let y = 0;
    for (let i = 0; i < 40; i++) {
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      const overlap =
        x < fx + fw && x + noW > fx && y < fy + fh && y + noH > fy;
      if (!overlap) break;
    }
    setNoPos({ x, y });
    setDodges((d) => d + 1);
  }, []);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col gap-6 py-4 text-center">
      <div className="space-y-4 pt-6 text-[1.05rem] leading-relaxed text-ink">
        <p>
          Enough ceremony. You&rsquo;ve passed every test and humored a small
          man with a large speech.
        </p>
        <p>
          So I&rsquo;ll ask plainly, the way I&rsquo;ve wanted to since the
          beginning:
        </p>
        <h2 className="font-serif text-3xl font-semibold text-wine">
          Will you go out with me?
        </h2>
      </div>

      <div ref={playRef} className="relative w-full flex-1">
        <motion.button
          ref={yesRef}
          onClick={onYes}
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="absolute left-1/2 top-1/2 flex min-h-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-wine px-10 text-xl font-semibold text-cream shadow-xl shadow-wine/30"
        >
          Yes
        </motion.button>

        <AnimatePresence>
          {!gone && (
            <motion.button
              ref={noRef}
              key="no"
              onPointerDown={(e) => {
                e.preventDefault();
                moveNo();
              }}
              onMouseEnter={() => moveNo()}
              onClick={(e) => {
                e.preventDefault();
                moveNo();
              }}
              animate={{ scale: tiny ? 0.65 : shrunk ? 0.82 : 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.18 }}
              style={
                noPos
                  ? { left: noPos.x, top: noPos.y }
                  : { left: "50%", bottom: 8, transform: "translateX(-50%)" }
              }
              className="absolute flex min-h-[48px] touch-none items-center justify-center rounded-2xl border border-wine/30 bg-cream px-6 text-base font-medium text-wine shadow-md"
            >
              {tiny ? "Yes (but tiny)" : "No"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — The calendar (date + daytime slot)                        */
/* ------------------------------------------------------------------ */
const SLOTS: { value: Slot; icon: string; label: string }[] = [
  { value: "Morning", icon: "☕", label: "Morning" },
  { value: "Midday", icon: "🌤️", label: "Midday" },
  { value: "Afternoon", icon: "🍦", label: "Afternoon" },
  { value: "Evening", icon: "🌙", label: "Evening" },
];

function CalendarStep({
  date,
  setDate,
  slot,
  setSlot,
  charm,
  outing,
  onLockIn,
}: {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  slot: Slot | null;
  setSlot: (s: Slot) => void;
  charm: number;
  outing: string | null;
  onLockIn: () => void;
}) {
  const today = startOfDay(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleLockIn = async () => {
    if (!date || !slot) return;
    setSubmitting(true);
    // Send her answer to me — but never let a hiccup block the moment.
    try {
      await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(date, "EEEE, MMMM d, yyyy"),
          slot,
          charm,
          outing,
        }),
      });
    } catch {
      /* ignore — proceed to celebration regardless */
    }
    onLockIn();
  };

  return (
    <div className="my-auto flex w-full flex-col items-center gap-6 text-center">
      <div className="space-y-3 text-[1.02rem] leading-relaxed text-ink">
        <p className="font-serif text-xl italic text-wine">
          There it is. I knew you had taste.
        </p>
        <p>
          But a &ldquo;yes&rdquo; is a beginning, not an end - now comes the
          delicate matter of <em>when</em>. Choose a day worthy of you, and an
          hour.
        </p>
      </div>

      <div className="rounded-3xl bg-cream/70 p-3 shadow-md">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          startMonth={today}
          disabled={[{ before: today }]}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        {SLOTS.map((s) => {
          const active = slot === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setSlot(s.value)}
              className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 text-base font-medium transition-colors ${
                active
                  ? "bg-wine text-cream shadow-md"
                  : "border border-wine/30 bg-cream/70 text-wine"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">
                {s.icon}
              </span>
              <span className="leading-none">{s.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLockIn}
        disabled={!date || !slot || submitting}
        className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {submitting ? "Sealing it…" : "Lock it in 🔒"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5 — Celebration                                               */
/* ------------------------------------------------------------------ */
function Celebration({ date, slot }: { date: Date; slot: Slot }) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      const colors = ["#7a2233", "#b6883b", "#f5e0db", "#ffffff"];
      confetti({ particleCount: 55, spread: 68, origin: { y: 0.65 }, colors });
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="my-auto flex w-full flex-col items-center gap-6 text-center">
      <p className="font-serif text-2xl italic text-wine">
        It&rsquo;s settled, then.
      </p>
      <p className="font-serif text-2xl font-semibold leading-snug text-ink">
        {format(date, "EEEE, MMMM d")}, {slot}.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-ink">
        I&rsquo;ll count the hours, and pretend I wasn&rsquo;t already.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-ink">
        The rest I want to tell you myself.
      </p>
      <Card>
        <p className="font-serif text-lg italic leading-relaxed text-wine">
          {CLOSING_LINE}
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                */
/* ------------------------------------------------------------------ */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-3xl border border-gold/30 bg-cream/80 p-6 shadow-lg shadow-wine/10">
      {children}
    </div>
  );
}

function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i === active ? "bg-wine" : "bg-wine/25"
          }`}
        />
      ))}
    </div>
  );
}
