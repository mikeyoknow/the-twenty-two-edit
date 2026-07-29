"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Vote = "absolutely" | "maybe" | "swap";
type VoteMap = Record<string, Vote | undefined>;
type ChoiceMap = Record<string, string | undefined>;
type DinnerChoice = "pie-bar" | "animl";

function LeoConstellation({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16 31 39 18 62 37 87 25 103 51 79 69 64 101 38 85 16 31Z" />
      <path d="m39 18-1 67m24-48 17 32m-41 16 41-16" />
      <circle cx="16" cy="31" r="3.5" />
      <circle cx="39" cy="18" r="4.5" />
      <circle cx="62" cy="37" r="3" />
      <circle cx="87" cy="25" r="4" />
      <circle cx="103" cy="51" r="3.5" />
      <circle cx="79" cy="69" r="4" />
      <circle cx="64" cy="101" r="4.5" />
      <circle cx="38" cy="85" r="3" />
    </svg>
  );
}

function LeoSunMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="48" cy="48" r="23" />
      <path d="M48 5v12M48 79v12M5 48h12M79 48h12M17.6 17.6l8.5 8.5M69.9 69.9l8.5 8.5M78.4 17.6l-8.5 8.5M26.1 69.9l-8.5 8.5" />
      <path d="M36 58c9-1 16-8 16-17 0-4-1-7-3-10 8 2 14 9 14 18 0 10-8 18-18 18-5 0-9-2-12-5 1-1 2-2 3-4Z" />
      <circle cx="57" cy="43" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const chapters = [
  {
    id: "portrait",
    number: "01",
    kicker: "The cover shoot",
    title: "Monochrome Portrait",
    time: "1:00–1:30 PM",
    place: "621A Bloor Street West",
    description:
      "A private black-and-white self-portrait session. We control the shutter, the poses, and which frames make the final edit.",
    note: "Bring one look that feels unmistakably you. Monography opens at 1 PM on Mondays.",
    tags: ["Fallback timing", "Private studio", "Finished photographs"],
    availability: "MONDAY OPENING · 1 PM",
    alternatives: ["Keep the photos, move the time", "Vintage fashion hunt", "Skip this chapter"],
    colour: "blue",
  },
  {
    id: "candles",
    number: "02",
    kicker: "The scent story",
    title: "Yummi Candle Workshop",
    time: "2:00–4:00 PM",
    place: "The Distillery District",
    description:
      "Choose, mix, pour, and name a collection of scents. The workshop is guided, relaxed, and everything comes home with us.",
    note: "Closed-toe shoes; excellent candle names encouraged.",
    tags: ["Hands-on", "Eight scents", "Take-home collection"],
    availability: "LIVE CHECK · 13 SPOTS AT 2 PM",
    alternatives: ["Keep it, choose fewer scents", "Mosaic lamp studio", "Skip this chapter"],
    colour: "rose",
  },
  {
    id: "karting",
    number: "03",
    kicker: "The main event",
    title: "K1 Championship",
    time: "6:30 PM · about 75 minutes",
    place: "Downsview",
    description:
      "A proper two-person racing championship: practice, fastest lap, and a final. Bragging rights remain valid for one full year.",
    note: "Comfortable clothes and closed-toe shoes. Trophy energy.",
    tags: ["Competitive", "High energy", "Birthday trophy"],
    availability: "75-MINUTE RACE BLOCK",
    alternatives: ["Keep K1, fewer races", "Activate Games", "Axe-throwing match"],
    colour: "gold",
  },
  {
    id: "dinner",
    number: "04",
    kicker: "The final look",
    title: "Birthday Dinner",
    time: "9:00 PM onwards",
    place: "Final reservation follows your vote",
    description:
      "The day lands somewhere genuinely worth dressing for—great food, a little theatre, and enough time to stay as long as we want.",
    note: "The restaurant is not a surprise. You choose the mood first.",
    tags: ["No rushing", "Dress-up moment", "Dessert mandatory"],
    availability: "MONDAY AT 9 · 2 OPEN OPTIONS",
    alternatives: ["Intimate & polished", "Lively sharing plates", "Chef’s counter"],
    colour: "plum",
  },
] as const;

const dinnerOptions = [
  {
    id: "pie-bar",
    name: "Pie Bar",
    cuisine: "Waterfront Italian",
    food: "Neapolitan-style pizza, house-made pasta, Italian starters, cocktails, and dessert by the lake.",
    vibe: "Relaxed, lively, and scenic",
    hours: "OPEN MONDAY · UNTIL 10 PM",
  },
  {
    id: "animl",
    name: "ANIML",
    cuisine: "Modern steakhouse & cocktail den",
    food: "Dry-aged steaks and wagyu, seafood, lobster pasta, polished sides, and dramatic cocktails.",
    vibe: "Fashion-forward, glamorous, and high-energy",
    hours: "OPEN MONDAY · DINNER UNTIL 10 PM",
  },
] as const satisfies ReadonlyArray<{
  id: DinnerChoice;
  name: string;
  cuisine: string;
  food: string;
  vibe: string;
  hours: string;
}>;

const dinnerLabels: Record<DinnerChoice, string> = {
  "pie-bar": "Pie Bar",
  animl: "ANIML",
};

const buffers = [
  {
    after: "portrait",
    time: "30 min",
    title: "Direct transfer",
    detail: "Bloor → Distillery. This is the tight part of the bookable fallback.",
  },
  {
    after: "candles",
    time: "2h 30m",
    title: "Candle cure + cross-town roam",
    detail: "Browse, snack, collect the candles, then drive to Downsview without sprinting.",
  },
  {
    after: "karting",
    time: "75 min",
    title: "The reset",
    detail: "Drive, change, fix hair, and arrive at dinner composed.",
  },
] as const;

const voteLabels: Record<Vote, string> = {
  absolutely: "Absolutely",
  maybe: "Maybe",
  swap: "Swap it",
};

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gateError, setGateError] = useState("");
  const [votes, setVotes] = useState<VoteMap>({});
  const [choices, setChoices] = useState<ChoiceMap>({});
  const [dinnerChoice, setDinnerChoice] = useState<DinnerChoice | "">("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUnlock = window.sessionStorage.getItem("twenty-two-edit-unlocked");
    if (savedUnlock === "yes") setUnlocked(true);

    const savedReview = window.localStorage.getItem("twenty-two-edit-review");
    if (savedReview) {
      try {
        const parsed = JSON.parse(savedReview);
        setVotes(parsed.votes ?? {});
        setChoices(parsed.choices ?? {});
        setDinnerChoice(parsed.dinnerChoice ?? "");
        setNote(parsed.note ?? "");
      } catch {
        window.localStorage.removeItem("twenty-two-edit-review");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "twenty-two-edit-review",
      JSON.stringify({ votes, choices, dinnerChoice, note }),
    );
  }, [votes, choices, dinnerChoice, note]);

  const answered = Object.keys(votes).length;
  const progress = (answered / chapters.length) * 100;

  const reviewText = useMemo(() => {
    const lines = chapters.map((chapter) => {
      const vote = votes[chapter.id];
      const choice = choices[chapter.id];
      const restaurant =
        chapter.id === "dinner" && dinnerChoice
          ? ` · ${dinnerLabels[dinnerChoice]}`
          : "";
      return `${chapter.number}. ${chapter.title}: ${
        vote ? voteLabels[vote] : "No vote yet"
      }${choice ? ` — ${choice}` : ""}${restaurant}`;
    });

    return [
      "HANNAH’S TWENTY-TWO EDIT",
      "Monday, August 10 · Toronto",
      "",
      ...lines,
      "",
      `Note: ${note.trim() || "No extra notes."}`,
    ].join("\n");
  }, [votes, choices, dinnerChoice, note]);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isCorrect =
      day.trim().padStart(2, "0") === "10" &&
      month.trim().padStart(2, "0") === "08" &&
      year.trim() === "2004";

    if (!isCorrect) {
      setGateError("That date belongs to another icon. Try yours.");
      return;
    }

    setGateError("");
    setUnlocking(true);
    window.sessionStorage.setItem("twenty-two-edit-unlocked", "yes");
    window.setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
    }, 650);
  }

  function setVote(id: string, vote: Vote) {
    setVotes((current) => ({ ...current, [id]: vote }));
    if (vote !== "swap") {
      setChoices((current) => ({ ...current, [id]: undefined }));
    }
  }

  async function copyReview() {
    await navigator.clipboard.writeText(reviewText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function resetReview() {
    setVotes({});
    setChoices({});
    setDinnerChoice("");
    setNote("");
    setCopied(false);
  }

  if (!unlocked) {
    return (
      <main className={`gate ${unlocking ? "is-unlocking" : ""}`}>
        <div className="gate-grain" aria-hidden="true" />
        <div className="gate-topline">
          <span>PRIVATE EDIT · 2026</span>
          <span>TORONTO · LEO SEASON</span>
        </div>

        <section className="gate-panel" aria-labelledby="gate-title">
          <div className="leo-orbit" aria-hidden="true">
            <LeoConstellation className="leo-constellation" />
            <span className="orbit-copy">TWENTY TWO · TWENTY TWO ·</span>
          </div>
          <p className="eyebrow">An agenda with veto power</p>
          <h1 id="gate-title">
            The Twenty-
            <br />
            Two Edit
          </h1>
          <p className="gate-intro">
            No mystery plans. No surprise dress code. Just one locked page that
            knows exactly who it belongs to.
          </p>

          <form className="date-lock" onSubmit={handleUnlock}>
            <fieldset>
              <legend>Enter the date that started the whole Leo situation.</legend>
              <label>
                <span>Day</span>
                <input
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="DD"
                  value={day}
                  onChange={(event) => setDay(event.target.value.replace(/\D/g, ""))}
                  aria-label="Birth day"
                />
              </label>
              <span className="date-slash" aria-hidden="true">/</span>
              <label>
                <span>Month</span>
                <input
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="MM"
                  value={month}
                  onChange={(event) => setMonth(event.target.value.replace(/\D/g, ""))}
                  aria-label="Birth month"
                />
              </label>
              <span className="date-slash" aria-hidden="true">/</span>
              <label className="year-field">
                <span>Year</span>
                <input
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="YYYY"
                  value={year}
                  onChange={(event) => setYear(event.target.value.replace(/\D/g, ""))}
                  aria-label="Birth year"
                />
              </label>
            </fieldset>

            <button className="unlock-button" type="submit">
              <span>Unlock your edit</span>
              <span aria-hidden="true">↗</span>
            </button>
            <p className="gate-error" aria-live="polite">
              {gateError || "Hint: it is your birthday, not mine."}
            </p>
          </form>
        </section>

        <div className="gate-footer">
          <span>H · 22</span>
          <span>Made for review, rearrangement & final approval</span>
        </div>
      </main>
    );
  }

  return (
    <main className="agenda-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="The Twenty-Two Edit home">
          THE <span>22</span> EDIT
        </a>
        <div className="header-meta">
          <span>MON · AUG 10</span>
          <span>TORONTO</span>
          <span className="leo-pill">
            <LeoSunMark className="leo-pill-icon" />
            LEO SEASON
          </span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Hannah’s birthday · Issue No. 22</p>
          <h1>
            Your day.
            <br />
            <em>Your Say.</em>
          </h1>
          <p className="hero-deck">Four Course. Four Parts. Four Memories.</p>
          <a className="review-link" href="#review">
            Start the review <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-number">22</div>
          <div className="sun-disc">
            <LeoSunMark className="hero-sun-icon" />
          </div>
          <p>THE BIRTHDAY ISSUE</p>
        </div>
      </section>

      <section className="brief">
        <div>
          <span className="brief-label">The premise</span>
          <p>Creative first. Competitive second. Beautiful food at the finish.</p>
        </div>
        <div>
          <span className="brief-label">Your authority</span>
          <p>Approve it, question it, or replace it. No explanations required.</p>
        </div>
        <div>
          <span className="brief-label">The pace</span>
          <p>Real buffers between every reservation. We are not chasing clocks.</p>
        </div>
      </section>

      <section className="review-section" id="review">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The proposed cut</p>
            <h2>Four chapters. Your call.</h2>
          </div>
          <div className="progress-block" aria-label={`${answered} of 4 plans reviewed`}>
            <div className="progress-copy">
              <span>{answered}/4 reviewed</span>
              <span>{answered === 4 ? "Final cut ready" : "In progress"}</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <aside className="schedule-check" aria-label="Live schedule check">
          <div className="schedule-check-mark" aria-hidden="true">
            <span>LIVE</span>
            <i />
          </div>
          <div>
            <p>Timing reality check · July 28</p>
            <h3>The one necessary shift.</h3>
            <p>
              The preferred request was Monochrome from 2:00–2:30 with a full
              hour before Yummi. Yummi’s actual August 10 classes are 2:00–4:00
              and 6:00–8:00; the evening class overlaps K1. The clean bookable
              cut moves Monography to its 1:00 PM opening and keeps Yummi at
              2:00 PM.
            </p>
          </div>
          <span className="schedule-stamp">BOOKABLE FALLBACK</span>
        </aside>

        <div className="timeline">
          {chapters.map((chapter, index) => {
            const currentVote = votes[chapter.id];
            const buffer = buffers.find((item) => item.after === chapter.id);

            return (
              <div className="timeline-unit" key={chapter.id}>
                <article className={`chapter-card ${chapter.colour}`}>
                  <div className="chapter-index">
                    <span>{chapter.number}</span>
                    <i aria-hidden="true" />
                  </div>

                  <div className="chapter-main">
                    <p className="chapter-kicker">{chapter.kicker}</p>
                    <h3>{chapter.title}</h3>
                    <div className="chapter-meta">
                      <span>{chapter.time}</span>
                      <span>{chapter.place}</span>
                    </div>
                    <p className="availability-stamp">{chapter.availability}</p>
                    <p className="chapter-description">{chapter.description}</p>
                    <p className="chapter-note">
                      <span>Wear note</span>
                      {chapter.note}
                    </p>
                    <div className="tag-row" aria-label="Highlights">
                      {chapter.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    {chapter.id === "dinner" && (
                      <div className="restaurant-ballot">
                        <div className="restaurant-heading">
                          <span>Choose the finish</span>
                          <p>Both are serving dinner at 9 PM on Monday.</p>
                        </div>
                        <div
                          className="restaurant-grid"
                          role="radiogroup"
                          aria-label="Dinner restaurant"
                        >
                          {dinnerOptions.map((restaurant) => (
                            <button
                              type="button"
                              role="radio"
                              aria-checked={dinnerChoice === restaurant.id}
                              className={
                                dinnerChoice === restaurant.id ? "selected" : ""
                              }
                              onClick={() => setDinnerChoice(restaurant.id)}
                              key={restaurant.id}
                            >
                              <span className="restaurant-hours">
                                {restaurant.hours}
                              </span>
                              <strong>{restaurant.name}</strong>
                              <em>{restaurant.cuisine}</em>
                              <p>{restaurant.food}</p>
                              <span className="restaurant-vibe">
                                {restaurant.vibe}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="monday-outs">
                          <p>
                            <strong>Not on Monday’s ballot:</strong> Don Alfonso
                            — fine-dining Italian tasting menus; closed Monday
                            and Tuesday.
                          </p>
                          <p>
                            Ultra — elevated Pan-Asian and East Asian-inspired
                            plates; closed Monday.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="vote-panel">
                    <p>Your vote</p>
                    <div className="vote-buttons">
                      {(["absolutely", "maybe", "swap"] as Vote[]).map((vote) => (
                        <button
                          type="button"
                          key={vote}
                          className={currentVote === vote ? "active" : ""}
                          aria-pressed={currentVote === vote}
                          onClick={() => setVote(chapter.id, vote)}
                        >
                          <span className="vote-mark" aria-hidden="true">
                            {vote === "absolutely" ? "✓" : vote === "maybe" ? "?" : "↻"}
                          </span>
                          {voteLabels[vote]}
                        </button>
                      ))}
                    </div>

                    {currentVote === "swap" && (
                      <div className="swap-panel">
                        <label htmlFor={`swap-${chapter.id}`}>Choose a direction</label>
                        <select
                          id={`swap-${chapter.id}`}
                          value={choices[chapter.id] ?? ""}
                          onChange={(event) =>
                            setChoices((current) => ({
                              ...current,
                              [chapter.id]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Pick one…</option>
                          {chapter.alternatives.map((option) => (
                            <option value={option} key={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </article>

                {buffer && index < chapters.length - 1 && (
                  <div className="buffer-card">
                    <span className="buffer-time">{buffer.time}</span>
                    <div>
                      <strong>{buffer.title}</strong>
                      <p>{buffer.detail}</p>
                    </div>
                    <span className="buffer-line" aria-hidden="true" />
                    <span className="buffer-badge">BUFFER</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="final-cut">
        <div className="final-copy">
          <p className="eyebrow">The final cut</p>
          <h2>Say what stays.</h2>
          <p>
            Your choices save on this device. Copy the review and send it back;
            the itinerary gets rebuilt around your answer.
          </p>
        </div>

        <div className="summary-card">
          <div className="summary-top">
            <span>HANNAH’S REVIEW</span>
            <span>{answered === 4 ? "READY TO SEND" : `${4 - answered} LEFT`}</span>
          </div>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <span>{chapter.number}</span>
                <div>
                  <strong>{chapter.title}</strong>
                  <p>
                    {votes[chapter.id]
                      ? voteLabels[votes[chapter.id] as Vote]
                      : "Awaiting your vote"}
                    {choices[chapter.id] ? ` · ${choices[chapter.id]}` : ""}
                    {chapter.id === "dinner" && dinnerChoice
                      ? ` · ${dinnerLabels[dinnerChoice]}`
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <label className="note-field">
            <span>Anything else?</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Move a time, change the energy, add a dress-code request…"
              rows={4}
            />
          </label>

          <div className="summary-actions">
            <button className="copy-button" type="button" onClick={copyReview}>
              {copied ? "Copied — send it to Erfan" : "Copy my final cut"}
              <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
            </button>
            <button className="reset-button" type="button" onClick={resetReview}>
              Reset votes
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-mark">22</div>
        <p>
          Designed for one Leo, one Monday in Toronto,
          <br />
          and absolutely no unwanted surprises.
        </p>
        <span>ERFAN × HANNAH · 10.08.2026</span>
      </footer>
    </main>
  );
}
