"use client";

import { FormEvent, Fragment, useEffect, useMemo, useState } from "react";

type PerkMap = Record<string, boolean | undefined>;
type DinnerChoice = "pie-bar" | "animl";
type ChapterId = "portrait" | "candles" | "karting";
type PlanChoiceMap = Record<ChapterId, string>;
type Edition = "original" | "late";

type PlanOption = {
  id: string;
  name: string;
  shortName: string;
  time: string;
  start: number;
  end: number;
  place: string;
  description: string;
  note: string;
  tags: readonly string[];
  availability: string;
  confidence: "confirmed" | "check" | "conditional";
  source?: string;
};

type ReviewState = {
  planChoices: PlanChoiceMap;
  perks: PerkMap;
  dinnerChoice: DinnerChoice | "";
  note: string;
};

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
    kicker: "The opening scene",
    title: "Choose the First Look",
    colour: "blue",
  },
  {
    id: "candles",
    number: "02",
    kicker: "The creative chapter",
    title: "Choose a Workshop",
    colour: "rose",
  },
  {
    id: "karting",
    number: "03",
    kicker: "The main event",
    title: "Choose the Competition",
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
    colour: "plum",
  },
] as const;

const dinnerChapter = chapters[3];

const planOptions: Record<ChapterId, readonly PlanOption[]> = {
  portrait: [
    {
      id: "monochrome",
      name: "Monography Monochrome",
      shortName: "Monochrome portrait",
      time: "1:00–1:30 PM",
      start: 13 * 60,
      end: 13 * 60 + 30,
      place: "621A Bloor Street West",
      description:
        "A private black-and-white self-portrait studio. We control the shutter, poses, and which frames make the final edit.",
      note: "Bring one camera-ready look that feels unmistakably you.",
      tags: ["Private studio", "Finished photographs", "30 minutes"],
      availability: "MONDAY OPENING · SLOT TO BOOK",
      confidence: "confirmed",
      source: "https://monography.ca/",
    },
    {
      id: "rose-aura",
      name: "Rose Aura Portrait",
      shortName: "Rose Aura portrait",
      time: "12:30–1:15 PM",
      start: 12 * 60 + 30,
      end: 13 * 60 + 15,
      place: "Rose Aura · 703 College Street",
      description:
        "A colourful aura portrait and reading on Instax Wide or rare discontinued FP-100C film—a strange, beautiful physical keepsake.",
      note: "Up to two people can share one portrait. New appointment dates are released monthly.",
      tags: ["Rare film", "Take-home portrait", "Reading included"],
      availability: "APPOINTMENT REQUIRED · AUG 10 TO CONFIRM",
      confidence: "check",
      source: "https://roseaura.ca/",
    },
    {
      id: "illusions",
      name: "Illusions Mission",
      shortName: "Illusions photo mission",
      time: "12:10–1:20 PM",
      start: 12 * 60 + 10,
      end: 13 * 60 + 20,
      place: "132 Front Street East",
      description:
        "An interactive visual playground turned into a competition: direct three impossible photos each, then choose the official birthday cover.",
      note: "Fast-moving, playful, and close to the Distillery—this one fills the chapter without feeling like a conventional attraction.",
      tags: ["Interactive", "Photo challenge", "70 minutes"],
      availability: "OPEN DAILY · 10 AM–8 PM",
      confidence: "confirmed",
      source: "https://museumofillusions.ca/buy-tickets/",
    },
    {
      id: "brunch",
      name: "The Birthday Brunch Cut",
      shortName: "birthday brunch",
      time: "12:00–1:15 PM",
      start: 12 * 60,
      end: 13 * 60 + 15,
      place: "Downtown Toronto · chosen together",
      description:
        "If breakfast with her brother changes, the opening chapter becomes a proper late brunch—somewhere worth dressing for, with time to linger.",
      note: "This only enters the final cut if she is free. The restaurant gets chosen together, never sprung on her.",
      tags: ["Conditional", "Food-first", "75 minutes"],
      availability: "ONLY IF BREAKFAST PLANS CHANGE",
      confidence: "conditional",
    },
  ],
  candles: [
    {
      id: "yummi",
      name: "Yummi Candle Workshop",
      shortName: "Yummi candles",
      time: "2:00–4:00 PM",
      start: 14 * 60,
      end: 16 * 60,
      place: "The Distillery District",
      description:
        "Choose, mix, pour, and name a collection of scents in a guided workshop. Everything comes home with us.",
      note: "Closed-toe shoes; excellent candle names encouraged.",
      tags: ["Hands-on", "Eight scents", "Take-home collection"],
      availability: "MONDAY CLASS · 2 PM",
      confidence: "confirmed",
      source: "https://yummicandles.ca/pages/candle-making-workshops",
    },
    {
      id: "mosaic",
      name: "DIYLabs Mosaic Lamp",
      shortName: "Turkish mosaic lamp",
      time: "2:00–4:30 PM",
      start: 14 * 60,
      end: 16 * 60 + 30,
      place: "DIYLabs · 877 Alness Street, North York",
      description:
        "Design a Turkish mosaic lamp over tea and baklava, then bring the finished lamp home after the guided studio session.",
      note: "The lamp travels home; the simple grout step happens after the glue dries.",
      tags: ["Beginner friendly", "Take-home lamp", "2.5 hours"],
      availability: "DAILY CLASS · 2 PM",
      confidence: "confirmed",
      source: "https://diylabs.ca/products/register",
    },
    {
      id: "lip-lab",
      name: "Lip Lab Custom Colour",
      shortName: "Custom lip colour",
      time: "2:15–3:15 PM",
      start: 14 * 60 + 15,
      end: 15 * 60 + 15,
      place: "Lip Lab · Queen West",
      description:
        "Create a one-of-one lipstick, gloss, balm, or cheek colour—then choose its scent, case, name, and engraving.",
      note: "The most fashion-forward option, fully finished and carried home.",
      tags: ["Custom shade", "Engraved", "About 1 hour"],
      availability: "RESERVATION TO CONFIRM",
      confidence: "check",
      source: "https://www.liplab.com/pages/experience",
    },
    {
      id: "fragrance",
      name: "Ratelier Custom Fragrance",
      shortName: "Custom fragrance",
      time: "2:00–4:30 PM",
      start: 14 * 60,
      end: 16 * 60 + 30,
      place: "Ratelier · Trinity Bellwoods",
      description:
        "Explore more than 100 ingredients, experiment, and blend a personal fragrance that can be bottled to take home.",
      note: "A private Monday daytime session has to be requested before this becomes bookable.",
      tags: ["100+ ingredients", "Personal formula", "2–2.5 hours"],
      availability: "MONDAY REQUEST · NOT YET CONFIRMED",
      confidence: "check",
      source: "https://www.ratelier.ca/workshop",
    },
  ],
  karting: [
    {
      id: "k1",
      name: "K1 Championship",
      shortName: "K1 championship",
      time: "6:30–7:45 PM",
      start: 18 * 60 + 30,
      end: 19 * 60 + 45,
      place: "K1 Speed · 75 Carl Hall Road",
      description:
        "A proper two-person racing championship: practice, fastest lap, and a final. Bragging rights last one full year.",
      note: "Comfortable clothes, closed-toe shoes, and trophy energy.",
      tags: ["Competitive", "High energy", "75 minutes"],
      availability: "OPEN MONDAY · UNTIL 10 PM",
      confidence: "confirmed",
      source: "https://www.k1speed.ca/location/toronto/",
    },
    {
      id: "activate",
      name: "Activate Stockyards",
      shortName: "Activate games",
      time: "6:30–7:45 PM",
      start: 18 * 60 + 30,
      end: 19 * 60 + 45,
      place: "Activate · 30 Weston Road",
      description:
        "Fast physical and mental game rooms built around lights, lasers, climbing, puzzles, teamwork, and score-chasing.",
      note: "A sneaker-and-comfortable-clothes chapter with lots of variety.",
      tags: ["Physical games", "Score chasing", "Open Monday"],
      availability: "OPEN MONDAY · 11 AM–10 PM",
      confidence: "confirmed",
      source: "https://playactivate.com/toronto-stockyards",
    },
    {
      id: "pursuit",
      name: "Pursuit OCR",
      shortName: "Pursuit obstacle course",
      time: "6:15–7:45 PM",
      start: 18 * 60 + 15,
      end: 19 * 60 + 45,
      place: "Pursuit OCR · 75 Westmore Drive",
      description:
        "A giant indoor obstacle playground with climbing, crawling, racing, and enough challenges to turn the night into a rematch.",
      note: "The most physical option; waiver, athletic clothes, and sneakers required.",
      tags: ["30,000 sq ft", "Obstacle course", "90 minutes"],
      availability: "OPEN MONDAY · 2–9:30 PM",
      confidence: "confirmed",
      source: "https://pursuitocr.com/",
    },
  ],
};

const lateChapters = [
  {
    id: "portrait",
    number: "01",
    kicker: "The first move",
    title: "Choose the First Move",
    colour: "blue",
  },
  {
    id: "candles",
    number: "02",
    kicker: "The after-hours workshop",
    title: "Choose the Creative Chapter",
    colour: "rose",
  },
  {
    id: "dinner",
    number: "03",
    kicker: "The final look",
    title: "Birthday Dinner",
    time: "9:00 PM onwards",
    place: "Final reservation follows your vote",
    description:
      "The Late Cut still lands somewhere worth dressing for—great food, a little theatre, and enough time to settle in.",
    note: "The restaurant is not a surprise. You choose the mood first.",
    tags: ["No rushing", "Dress-up moment", "Dessert mandatory"],
    availability: "MONDAY AT 9 · 2 OPEN OPTIONS",
    colour: "plum",
  },
] as const;

const latePlanOptions: Record<ChapterId, readonly PlanOption[]> = {
  portrait: [
    {
      id: "late-k1",
      name: "K1 Championship",
      shortName: "K1 championship",
      time: "3:00–4:15 PM",
      start: 15 * 60,
      end: 16 * 60 + 15,
      place: "K1 Speed · 75 Carl Hall Road",
      description:
        "Start north of downtown with a proper two-person racing championship: practice, fastest lap, and a final.",
      note: "The cleanest Thornhill route. Comfortable clothes, closed-toe shoes, and trophy energy.",
      tags: ["Recommended route", "Competitive", "75 minutes"],
      availability: "OPEN MONDAY · UNTIL 10 PM",
      confidence: "confirmed",
      source: "https://www.k1speed.ca/location/toronto/",
    },
    {
      id: "late-rose-aura",
      name: "Rose Aura Portrait",
      shortName: "Rose Aura portrait",
      time: "3:15–4:00 PM",
      start: 15 * 60 + 15,
      end: 16 * 60,
      place: "Rose Aura · 703 College Street",
      description:
        "A colourful aura portrait and reading on physical film—the quietest, strangest keepsake in the Late Cut.",
      note: "Appointment only. New dates are released monthly, so this stays a confirm-first choice.",
      tags: ["Rare film", "Take-home portrait", "45 minutes"],
      availability: "APPOINTMENT REQUIRED · AUG 10 TO CONFIRM",
      confidence: "check",
      source: "https://roseaura.ca/",
    },
    {
      id: "late-illusions",
      name: "Illusions Mission",
      shortName: "Illusions photo mission",
      time: "3:20–4:30 PM",
      start: 15 * 60 + 20,
      end: 16 * 60 + 30,
      place: "132 Front Street East",
      description:
        "Turn the visual playground into a photo competition, then stay downtown for the creative chapter.",
      note: "The easiest downtown handoff: this leaves a full ninety minutes before Yummi.",
      tags: ["Interactive", "Photo challenge", "70 minutes"],
      availability: "OPEN DAILY · 10 AM–8 PM",
      confidence: "confirmed",
      source: "https://museumofillusions.ca/buy-tickets/",
    },
    {
      id: "late-activate",
      name: "Activate Stockyards",
      shortName: "Activate games",
      time: "3:15–4:30 PM",
      start: 15 * 60 + 15,
      end: 16 * 60 + 30,
      place: "Activate · 30 Weston Road",
      description:
        "Fast physical and mental rooms built around lights, lasers, climbing, puzzles, teamwork, and score-chasing.",
      note: "A strong middle route between Thornhill and downtown, with enough time to reset before the workshop.",
      tags: ["Physical games", "Score chasing", "75 minutes"],
      availability: "OPEN MONDAY · 11 AM–10 PM",
      confidence: "confirmed",
      source: "https://playactivate.com/toronto-stockyards",
    },
    {
      id: "late-pursuit",
      name: "Pursuit OCR",
      shortName: "Pursuit obstacle course",
      time: "3:15–4:45 PM",
      start: 15 * 60 + 15,
      end: 16 * 60 + 45,
      place: "Pursuit OCR · 75 Westmore Drive",
      description:
        "A giant indoor obstacle playground with climbing, crawling, racing, and enough challenges to demand a rematch.",
      note: "The most physical choice and the longest rush-hour transfer to the Distillery. Book only with route confidence.",
      tags: ["Tightest route", "Obstacle course", "90 minutes"],
      availability: "OPEN MONDAY · ROUTE NEEDS CARE",
      confidence: "check",
      source: "https://pursuitocr.com/",
    },
  ],
  candles: [
    {
      id: "late-yummi",
      name: "Yummi Candle Workshop",
      shortName: "Yummi candles",
      time: "6:00–8:00 PM",
      start: 18 * 60,
      end: 20 * 60,
      place: "Yummi · The Distillery District",
      description:
        "Choose, mix, pour, and name a collection of scents in the official evening workshop. Everything comes home with us.",
      note: "The recommended Late Cut workshop. The candles cool while we reset for dinner.",
      tags: ["Recommended route", "Eight scents", "Take-home collection"],
      availability: "MONDAY CLASS · 6 PM",
      confidence: "confirmed",
      source: "https://www.yummicandles.ca/pages/scented-candle-workshop",
    },
    {
      id: "late-lip-lab",
      name: "Lip Lab Custom Colour",
      shortName: "Custom lip colour",
      time: "6:00–7:00 PM",
      start: 18 * 60,
      end: 19 * 60,
      place: "Lip Lab · Toronto studio to confirm",
      description:
        "Create a one-of-one lipstick, gloss, balm, or cheek colour—then choose its scent, case, name, and engraving.",
      note: "The fashion-forward short workshop. Confirm the Monday reservation and Toronto studio before booking.",
      tags: ["Custom shade", "Engraved", "About 1 hour"],
      availability: "EVENING RESERVATION TO CONFIRM",
      confidence: "check",
      source:
        "https://www.liplab.com/pages/lip-lab-experience-frequently-asked-questions",
    },
    {
      id: "late-fragrance",
      name: "Ratelier Custom Fragrance",
      shortName: "Custom fragrance",
      time: "6:00–8:30 PM",
      start: 18 * 60,
      end: 20 * 60 + 30,
      place: "Ratelier · Trinity Bellwoods",
      description:
        "Explore more than 100 ingredients, experiment, and blend a personal fragrance that can be bottled to take home.",
      note: "A private Monday evening session has to be requested. It leaves a precise thirty-minute dinner transfer.",
      tags: ["100+ ingredients", "Personal formula", "2.5 hours"],
      availability: "PRIVATE EVENING REQUEST · TIGHT FINISH",
      confidence: "check",
      source: "https://www.ratelier.ca/workshop",
    },
  ],
  karting: [],
};

const defaultPlanChoices: PlanChoiceMap = {
  portrait: "monochrome",
  candles: "yummi",
  karting: "k1",
};

const defaultLatePlanChoices: PlanChoiceMap = {
  portrait: "late-k1",
  candles: "late-yummi",
  karting: "",
};

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

const birthdayPerks = [
  {
    id: "starbucks",
    name: "Starbucks",
    reward: "A handcrafted drink, food item, or ready-to-drink bottled beverage.",
    timing: "First stop · just after pickup",
    route: "The opening move after pickup",
    eligibility:
      "Rewards account must be 7+ days old, have her birthday saved, and have one Star-earning purchase this year. Green-tier reward is valid on her birthday.",
    prep: "SET UP BY AUG 3",
    source: "https://www.starbucks.ca/rewards/terms/",
  },
  {
    id: "chatime",
    name: "Chatime",
    reward: "A free birthday drink in the Societea app.",
    timing: "Afternoon buffer · optional",
    route: "Easy add-on if a participating store fits the drive",
    eligibility:
      "Join Societea and make one qualifying loyalty purchase before her birthday. The birthday coupon is valid for 7 days.",
    prep: "MAKE 1 PURCHASE BEFORE AUG 10",
    source: "https://chatime.ca/rewards/",
  },
  {
    id: "booster",
    name: "Booster Juice",
    reward: "The birthday offer shown in the Booster Rewards app.",
    timing: "Cross-town buffer · optional",
    route: "A healthier pit stop between chapters",
    eligibility:
      "Account must be 7+ days old with her birthday saved and one qualifying purchase in the past year. The offer is valid for 7 days.",
    prep: "SET UP BY AUG 3",
    source: "https://boosterjuice.com/en-ca/a/faq",
  },
  {
    id: "sephora",
    name: "Sephora",
    reward: "Her choice of a Beauty Insider birthday mini set, while supplies last.",
    timing: "Long afternoon buffer · optional",
    route: "The fashion-and-beauty detour before K1",
    eligibility:
      "Beauty Insider members can redeem in a Canadian store during their birthday window. No purchase is required in store.",
    prep: "CHECK BEAUTY INSIDER ACCOUNT",
    source: "https://www.sephora.com/ca/en/beauty/birthday-gift",
  },
] as const;

const defaultPerks: PerkMap = {
  starbucks: true,
};

const sephoraRestockId = "sephora-restock";
const sephoraRestockDuration = 45;

const defaultReviews: Record<Edition, ReviewState> = {
  original: {
    planChoices: defaultPlanChoices,
    perks: defaultPerks,
    dinnerChoice: "",
    note: "",
  },
  late: {
    planChoices: defaultLatePlanChoices,
    perks: defaultPerks,
    dinnerChoice: "",
    note: "",
  },
};

function mergeReview(
  base: ReviewState,
  saved?: Partial<ReviewState>,
): ReviewState {
  return {
    ...base,
    ...saved,
    planChoices: {
      ...base.planChoices,
      ...(saved?.planChoices ?? {}),
    },
    perks: saved?.perks ?? base.perks,
  };
}

function getPlanOption(
  options: Record<ChapterId, readonly PlanOption[]>,
  chapter: ChapterId,
  optionId: string,
) {
  const fallback = options[chapter][0];
  if (!fallback) {
    throw new Error(`No plan options configured for ${chapter}`);
  }
  return options[chapter].find((option) => option.id === optionId) ?? fallback;
}

function formatClock(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gateError, setGateError] = useState("");
  const [edition, setEdition] = useState<Edition>("original");
  const [reviews, setReviews] =
    useState<Record<Edition, ReviewState>>(defaultReviews);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUnlock = window.sessionStorage.getItem("twenty-two-edit-unlocked");
    // This is a one-time restore from browser storage after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedUnlock === "yes") setUnlocked(true);

    const savedEdition = window.localStorage.getItem("twenty-two-edit-edition");
    if (savedEdition === "original" || savedEdition === "late") {
      setEdition(savedEdition);
    }

    const savedReviews = window.localStorage.getItem(
      "twenty-two-edit-reviews-v2",
    );
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews) as Partial<
          Record<Edition, Partial<ReviewState>>
        >;
        setReviews({
          original: mergeReview(defaultReviews.original, parsed.original),
          late: mergeReview(defaultReviews.late, parsed.late),
        });
      } catch {
        window.localStorage.removeItem("twenty-two-edit-reviews-v2");
      }
    } else {
      const legacyReview = window.localStorage.getItem("twenty-two-edit-review");
      if (legacyReview) {
        try {
          const parsed = JSON.parse(legacyReview) as Partial<ReviewState>;
          setReviews({
            ...defaultReviews,
            original: mergeReview(defaultReviews.original, parsed),
          });
        } catch {
          window.localStorage.removeItem("twenty-two-edit-review");
        }
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "twenty-two-edit-reviews-v2",
      JSON.stringify(reviews),
    );
    window.localStorage.setItem("twenty-two-edit-edition", edition);
  }, [edition, hydrated, reviews]);

  const currentReview = reviews[edition];
  const activeChapters = edition === "late" ? lateChapters : chapters;
  const activePlanOptions =
    edition === "late" ? latePlanOptions : planOptions;
  const currentDinnerChapter =
    edition === "late" ? lateChapters[2] : dinnerChapter;
  const selectedPortrait = getPlanOption(
    activePlanOptions,
    "portrait",
    currentReview.planChoices.portrait,
  );
  const selectedWorkshop = getPlanOption(
    activePlanOptions,
    "candles",
    currentReview.planChoices.candles,
  );
  const selectedEvent =
    edition === "original"
      ? getPlanOption(
          activePlanOptions,
          "karting",
          currentReview.planChoices.karting,
        )
      : null;
  const activeActivities = selectedEvent
    ? [selectedPortrait, selectedWorkshop, selectedEvent]
    : [selectedPortrait, selectedWorkshop];
  const pickupTime = edition === "late" ? 14 * 60 : selectedPortrait.start - 60;
  const choiceCount = activeChapters.length - 1;
  const answered = choiceCount + (currentReview.dinnerChoice ? 1 : 0);
  const progress = (answered / activeChapters.length) * 100;
  const selectedPerks = useMemo(
    () =>
      birthdayPerks.filter((perk) => currentReview.perks[perk.id]),
    [currentReview.perks],
  );
  const sephoraRestockSelected = Boolean(
    currentReview.perks[sephoraRestockId],
  );
  const restockAfterChapter: ChapterId =
    edition === "late" ? "portrait" : "candles";
  const restockStart =
    edition === "late"
      ? Math.max(
          selectedPortrait.end + 15,
          selectedWorkshop.start - sephoraRestockDuration - 30,
        )
      : Math.max(
          selectedWorkshop.end + 15,
          selectedEvent!.start - sephoraRestockDuration - 45,
        );
  const restockEnd = restockStart + sephoraRestockDuration;
  const liveBuffers =
    edition === "late"
      ? [
          {
            after: "portrait",
            minutes:
              selectedWorkshop.start -
              selectedPortrait.end -
              (sephoraRestockSelected ? sephoraRestockDuration : 0),
            title: "The cross-town glide",
            detail: `${selectedPortrait.place} → ${selectedWorkshop.place}${
              sephoraRestockSelected
                ? " · the Sephora restock run lives inside this window"
                : ""
            }`,
          },
          {
            after: "candles",
            minutes: 21 * 60 - selectedWorkshop.end,
            title: "The dinner runway",
            detail: `${selectedWorkshop.place} → dinner · collect, change, arrive composed`,
          },
        ]
      : [
          {
            after: "portrait",
            minutes: selectedWorkshop.start - selectedPortrait.end,
            title: "Transfer to the creative chapter",
            detail: `${selectedPortrait.place} → ${selectedWorkshop.place}`,
          },
          {
            after: "candles",
            minutes:
              selectedEvent!.start -
              selectedWorkshop.end -
              (sephoraRestockSelected ? sephoraRestockDuration : 0),
            title: "The roam",
            detail: `${selectedWorkshop.place} → ${selectedEvent!.place}${
              sephoraRestockSelected
                ? " · the Sephora restock run lives inside this window"
                : ""
            }`,
          },
          {
            after: "karting",
            minutes: 21 * 60 - selectedEvent!.end,
            title: "The reset",
            detail: `${selectedEvent!.place} → dinner · change, fix hair, arrive composed`,
          },
        ];
  const minimumBuffer = Math.min(
    ...liveBuffers.map((buffer) => buffer.minutes),
  );
  const bufferNeedsAttention =
    minimumBuffer < (edition === "late" ? 45 : 30);
  const reviewText = [
    edition === "late"
      ? "HANNAH’S TWENTY-TWO EDIT · THE LATE CUT"
      : "HANNAH’S TWENTY-TWO EDIT · ORIGINAL CUT",
    `Monday, August 10 · ${
      edition === "late" ? "Thornhill → Toronto" : "Toronto"
    }`,
    `Pickup: ${formatClock(pickupTime)}${
      edition === "late" ? " · Thornhill" : ""
    }`,
    `Birthday perks: ${
      selectedPerks.length
        ? selectedPerks.map((perk) => perk.name).join(", ")
        : "Skip the perks run"
    }`,
    `Beauty edit: ${
      sephoraRestockSelected
        ? `Sephora Restock Run · ${formatClock(restockStart)}–${formatClock(
            restockEnd,
          )}`
        : "Skip the Sephora Restock Run"
    }`,
    "",
    ...activeActivities.map(
      (activity, index) =>
        `${String(index + 1).padStart(2, "0")}. ${activity.name} · ${
          activity.time
        }`,
    ),
    `${String(activeActivities.length + 1).padStart(2, "0")}. ${
      currentReview.dinnerChoice
        ? dinnerLabels[currentReview.dinnerChoice]
        : "Dinner choice pending"
    } · 9:00 PM`,
    "",
    `Note: ${currentReview.note.trim() || "No extra notes."}`,
  ].join("\n");

  function updateCurrentReview(
    updater: (review: ReviewState) => ReviewState,
  ) {
    setReviews((current) => ({
      ...current,
      [edition]: updater(current[edition]),
    }));
  }

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

  async function copyReview() {
    await navigator.clipboard.writeText(reviewText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function resetReview() {
    setReviews((current) => ({
      ...current,
      [edition]: defaultReviews[edition],
    }));
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
    <main
      className={`agenda-shell ${
        edition === "late" ? "late-edition" : "original-edition"
      }`}
    >
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="The Twenty-Two Edit home">
          THE <span>22</span> EDIT
        </a>
        <div className="header-actions">
          <div
            className="edition-switcher"
            role="group"
            aria-label="Choose birthday edition"
          >
            <button
              type="button"
              aria-pressed={edition === "original"}
              onClick={() => {
                setEdition("original");
                setCopied(false);
              }}
            >
              Original Cut
            </button>
            <button
              type="button"
              aria-pressed={edition === "late"}
              onClick={() => {
                setEdition("late");
                setCopied(false);
              }}
            >
              Late Cut
            </button>
          </div>
          <div className="header-meta">
            <span>MON · AUG 10</span>
            <span>{edition === "late" ? "THORNHILL → TORONTO" : "TORONTO"}</span>
            <span className="leo-pill">
              <LeoSunMark className="leo-pill-icon" />
              {edition === "late" ? "AFTER HOURS" : "LEO SEASON"}
            </span>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            Hannah’s birthday ·{" "}
            {edition === "late" ? "The Late Cut" : "Issue No. 22"}
          </p>
          <h1>
            {edition === "late" ? "Start later." : "Your day."}
            <br />
            <em>{edition === "late" ? "Keep the night." : "Your Say."}</em>
          </h1>
          <p className="hero-deck">
            {edition === "late"
              ? "Two o’clock pickup. Three chapters. Zero rushing."
              : "Four Course. Four Parts. Four Memories."}
          </p>
          <a className="review-link" href="#review">
            Start the review <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-number">22</div>
          <div className="sun-disc">
            <LeoSunMark className="hero-sun-icon" />
          </div>
          <p>
            {edition === "late" ? "THE AFTER-HOURS EDITION" : "THE BIRTHDAY ISSUE"}
          </p>
        </div>
      </section>

      <section className="brief">
        <div>
          <span className="brief-label">The premise</span>
          <p>
            {edition === "late"
              ? "Pick up in Thornhill. Make the first move. Create after six."
              : "A memorable opening. Creative second. Competitive before dinner."}
          </p>
        </div>
        <div>
          <span className="brief-label">Your authority</span>
          <p>Approve it, question it, or replace it. No explanations required.</p>
        </div>
        <div>
          <span className="brief-label">The pace</span>
          <p>
            {edition === "late"
              ? "The route moves south once. Rush hour gets a real buffer."
              : "Real buffers between every reservation. We are not chasing clocks."}
          </p>
        </div>
      </section>

      <section className="review-section" id="review">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {edition === "late" ? "The alternate cut" : "The proposed cut"}
            </p>
            <h2>
              {activeChapters.length} chapters. Your call.
            </h2>
          </div>
          <div
            className="progress-block"
            aria-label={`${answered} of ${activeChapters.length} plans reviewed`}
          >
            <div className="progress-copy">
              <span>
                {answered}/{activeChapters.length} selected
              </span>
              <span>
                {answered === activeChapters.length
                  ? "Your timetable is ready"
                  : "Choose dinner to finish"}
              </span>
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
            <p>Live itinerary · updates with every choice</p>
            <h3>
              {edition === "late"
                ? "The route starts north and moves south."
                : "Every option fits the same day."}
            </h3>
            <p>
              {edition === "late"
                ? "Pickup stays fixed at 2 PM in Thornhill. Every choice below recalculates the rush-hour transfer and dinner runway."
                : "Choose one card in each chapter. The timetable at the bottom automatically rebuilds the pickup, reservations, travel windows, and reset time around your version of the day."}
            </p>
          </div>
          <span className="schedule-stamp">PICK · MIX · REVIEW</span>
        </aside>

        <section className="pickup-prelude" aria-labelledby="pickup-title">
          <div className="pickup-time">
            <span>{formatClock(pickupTime).replace(/ [AP]M$/, "")}</span>
            <small>{formatClock(pickupTime).slice(-2)}</small>
          </div>
          <div className="pickup-copy">
            <p className="pickup-kicker">Prelude 00 · your chariot arrives</p>
            <h3 id="pickup-title">Birthday pickup</h3>
            <p>
              {edition === "late" ? (
                <>
                  Two o’clock in Thornhill, on purpose: enough time for the first
                  birthday reward and a calm arrival at{" "}
                  {selectedPortrait.shortName}.
                </>
              ) : (
                <>
                  One full hour before the first booking: enough time for the
                  first birthday reward, the drive, and a calm arrival at{" "}
                  {selectedPortrait.shortName}.
                </>
              )}
            </p>
          </div>
          <div className="pickup-notes">
            <span>{edition === "late" ? "Pickup · Thornhill" : "Camera-ready look"}</span>
            <span>Closed-toe shoes in the car</span>
            <span>{edition === "late" ? "One southbound route" : "No rushing"}</span>
          </div>
        </section>

        <section className="perks-run" aria-labelledby="perks-title">
          <div className="perks-intro">
            <div>
              <p className="eyebrow">The birthday perks run</p>
              <h3 id="perks-title">A few gifts from the city.</h3>
            </div>
            <p>
              {edition === "late"
                ? "Starbucks opens the Thornhill pickup. Add only the extras that fit the southbound route or the downtown buffer."
                : "Starbucks opens the day. Add only the extras that feel fun; the flexible ones slip into the afternoon buffers."}
            </p>
          </div>

          <div className="perks-grid">
            {birthdayPerks.map((perk, index) => {
              const selected = Boolean(currentReview.perks[perk.id]);
              return (
                <article className={selected ? "perk-card selected" : "perk-card"} key={perk.id}>
                  <div className="perk-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="perk-card-top">
                    <span>{perk.timing}</span>
                    <span>{selected ? "ON THE ROUTE" : "OPTIONAL"}</span>
                  </div>
                  <h4>{perk.name}</h4>
                  <p className="perk-reward">{perk.reward}</p>
                  <p className="perk-route">{perk.route}</p>
                  <details>
                    <summary>How to unlock it</summary>
                    <p>{perk.eligibility}</p>
                    <a href={perk.source} target="_blank" rel="noreferrer">
                      Official terms <span aria-hidden="true">↗</span>
                    </a>
                  </details>
                  <div className="perk-action">
                    <span>{perk.prep}</span>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        updateCurrentReview((review) => ({
                          ...review,
                          perks: {
                            ...review.perks,
                            [perk.id]: !selected,
                          },
                        }))
                      }
                    >
                      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
                      {selected ? "Keep it" : "Add stop"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="perks-fineprint">
            Rewards depend on account eligibility, participating locations, and
            availability. We check the apps before leaving; the schedule never
            depends on a freebie.
          </p>

          <article
            className={
              sephoraRestockSelected
                ? "restock-option selected"
                : "restock-option"
            }
          >
            <div className="restock-bag" aria-hidden="true">
              <span>22</span>
            </div>
            <div className="restock-copy">
              <div className="restock-labels">
                <span>THE BEAUTY EDIT</span>
                <span>
                  {formatClock(restockStart)}–{formatClock(restockEnd)}
                </span>
              </div>
              <h4>Sephora Restock Run</h4>
              <p>
                I hand you a birthday bag; you take the lead through Sephora
                and replenish the makeup staples, shades, and favourites you
                actually want.
              </p>
              <span className="restock-route">
                45 MINUTES · BEST STORE FOR THE SELECTED ROUTE
              </span>
            </div>
            <button
              type="button"
              aria-pressed={sephoraRestockSelected}
              onClick={() =>
                updateCurrentReview((review) => ({
                  ...review,
                  perks: {
                    ...review.perks,
                    [sephoraRestockId]: !sephoraRestockSelected,
                  },
                }))
              }
            >
              <span aria-hidden="true">
                {sephoraRestockSelected ? "✓" : "+"}
              </span>
              {sephoraRestockSelected ? "Keep the run" : "Add the run"}
            </button>
          </article>
        </section>

        <div className="timeline">
          {activeChapters.map((chapter) => {
            const choiceChapterId: ChapterId | null =
              chapter.id === "dinner" ? null : chapter.id;
            const chapterOptions = choiceChapterId
              ? activePlanOptions[choiceChapterId]
              : null;
            const selectedOption =
              choiceChapterId
                ? getPlanOption(
                    activePlanOptions,
                    choiceChapterId,
                    currentReview.planChoices[choiceChapterId],
                  )
                : null;
            const buffer = liveBuffers.find(
              (item) => item.after === chapter.id,
            );

            return (
              <div className="timeline-unit" key={chapter.id}>
                <article className={`chapter-card ${chapter.colour}`}>
                  <div className="chapter-index">
                    <span>{chapter.number}</span>
                    <i aria-hidden="true" />
                  </div>

                  <div className="chapter-main">
                    <p className="chapter-kicker">{chapter.kicker}</p>
                    <p className="choice-context">{chapter.title}</p>

                    {selectedOption && chapterOptions && choiceChapterId ? (
                      <>
                        <h3>{selectedOption.name}</h3>
                        <div className="chapter-meta">
                          <span>{selectedOption.time}</span>
                          <span>{selectedOption.place}</span>
                        </div>
                        <p
                          className={`availability-stamp ${
                            selectedOption.confidence !== "confirmed"
                              ? "needs-check"
                              : ""
                          }`}
                        >
                          {selectedOption.availability}
                        </p>
                        <p className="chapter-description">
                          {selectedOption.description}
                        </p>
                        <p className="chapter-note">
                          <span>Good to know</span>
                          {selectedOption.note}
                        </p>
                        <div className="tag-row" aria-label="Highlights">
                          {selectedOption.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>

                        <div className="choice-ballot">
                          <div className="choice-ballot-heading">
                            <span>
                              {chapterOptions.length} ways to play this
                              chapter
                            </span>
                            <p>
                              Pick one. Your timetable rebuilds itself below.
                            </p>
                          </div>
                          <div
                            className="plan-option-grid"
                            role="radiogroup"
                            aria-label={chapter.title}
                          >
                            {chapterOptions.map((option) => {
                              const selected = selectedOption.id === option.id;
                              return (
                                <article
                                  className={
                                    selected
                                      ? "plan-option selected"
                                      : "plan-option"
                                  }
                                  key={option.id}
                                >
                                  <button
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() =>
                                      updateCurrentReview((review) => ({
                                        ...review,
                                        planChoices: {
                                          ...review.planChoices,
                                          [choiceChapterId]: option.id,
                                        },
                                      }))
                                    }
                                  >
                                    <span className="plan-option-top">
                                      <i aria-hidden="true">
                                        {selected ? "✓" : ""}
                                      </i>
                                      <span
                                        className={
                                          option.confidence !== "confirmed"
                                            ? "option-status needs-check"
                                            : "option-status"
                                        }
                                      >
                                        {option.confidence === "check"
                                          ? "Confirm first"
                                          : option.confidence === "conditional"
                                            ? "If plans change"
                                            : "Monday-ready"}
                                      </span>
                                    </span>
                                    <strong>{option.name}</strong>
                                    <em>{option.time}</em>
                                    <p>{option.description}</p>
                                    <span className="option-place">
                                      {option.place}
                                    </span>
                                  </button>
                                  {option.source ? (
                                    <a
                                      href={option.source}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Official details{" "}
                                      <span aria-hidden="true">↗</span>
                                    </a>
                                  ) : (
                                    <span className="option-link-placeholder">
                                      Venue chosen together
                                    </span>
                                  )}
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3>{chapter.title}</h3>
                        <div className="chapter-meta">
                          <span>{currentDinnerChapter.time}</span>
                          <span>{currentDinnerChapter.place}</span>
                        </div>
                        <p className="availability-stamp">
                          {currentDinnerChapter.availability}
                        </p>
                        <p className="chapter-description">
                          {currentDinnerChapter.description}
                        </p>
                        <p className="chapter-note">
                          <span>Good to know</span>
                          {currentDinnerChapter.note}
                        </p>
                        <div className="tag-row" aria-label="Highlights">
                          {currentDinnerChapter.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>

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
                              aria-checked={
                                currentReview.dinnerChoice === restaurant.id
                              }
                              className={
                                currentReview.dinnerChoice === restaurant.id
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                updateCurrentReview((review) => ({
                                  ...review,
                                  dinnerChoice: restaurant.id,
                                }))
                              }
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
                      </>
                    )}
                  </div>
                </article>

                {buffer && (
                  <div className="buffer-card">
                    <span className="buffer-time">
                      {formatDuration(buffer.minutes)}
                    </span>
                    <div>
                      <strong>{buffer.title}</strong>
                      <p>{buffer.detail}</p>
                    </div>
                    <span className="buffer-line" aria-hidden="true" />
                    <span className="buffer-badge">
                      {buffer.minutes < (edition === "late" ? 45 : 30)
                        ? "CHECK ROUTE"
                        : "BUFFER"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="final-cut">
        <div className="final-copy">
          <p className="eyebrow">Your live timetable</p>
          <h2>The day, assembled.</h2>
          <p>
            Every choice above lands here with its real time and location. Your
            selections save on this device, so you can come back and keep
            editing.
          </p>
        </div>

        <div className="summary-card">
          <div className="summary-top">
            <span>
              MONDAY · AUGUST 10 ·{" "}
              {edition === "late" ? "THORNHILL → TORONTO" : "TORONTO"}
            </span>
            <span>
              {answered === activeChapters.length
                ? "FINAL CUT READY"
                : "DINNER PENDING"}
            </span>
          </div>

          <div
            className={
              bufferNeedsAttention
                ? "schedule-health needs-attention"
                : "schedule-health"
            }
          >
            <span aria-hidden="true">{bufferNeedsAttention ? "!" : "✓"}</span>
            <div>
              <strong>
                {bufferNeedsAttention
                  ? "One transfer needs attention"
                  : "No collisions in this cut"}
              </strong>
              <p>
                Smallest buffer: {formatDuration(minimumBuffer)} ·{" "}
                {edition === "late"
                  ? "Pickup stays fixed at 2:00 PM in Thornhill."
                  : "Pickup stays one hour before the opening chapter."}
              </p>
            </div>
          </div>

          <div className="timetable" aria-label="Selected birthday timetable">
            <div className="timetable-row pickup-row">
              <time>{formatClock(pickupTime)}</time>
              <span className="timetable-marker" aria-hidden="true" />
              <div>
                <span>PRELUDE</span>
                <strong>Birthday pickup</strong>
                <p>
                  {selectedPerks.length
                    ? `Perks on the route: ${selectedPerks
                        .map((perk) => perk.name)
                        .join(" · ")}`
                    : `Direct to the ${
                        edition === "late" ? "first move" : "opening chapter"
                      }—no perks detour.`}
                  {edition === "late" ? " · Thornhill" : ""}
                </p>
              </div>
            </div>

            {activeActivities.map((activity, index) => {
              const buffer = liveBuffers[index];
              return (
                <Fragment key={activity.id}>
                  <div className="timetable-row">
                    <time>{formatClock(activity.start)}</time>
                    <span className="timetable-marker" aria-hidden="true" />
                    <div>
                      <span>
                        CHAPTER {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{activity.name}</strong>
                      <p>
                        {activity.time} · {activity.place}
                      </p>
                    </div>
                  </div>

                  {sephoraRestockSelected &&
                    activity.id ===
                      currentReview.planChoices[restockAfterChapter] && (
                      <div className="timetable-row restock-row">
                        <time>{formatClock(restockStart)}</time>
                        <span
                          className="timetable-marker"
                          aria-hidden="true"
                        />
                        <div>
                          <span>EXTRA EDIT</span>
                          <strong>Sephora Restock Run</strong>
                          <p>
                            {formatClock(restockStart)}–
                            {formatClock(restockEnd)} · birthday bag + her
                            makeup-stock picks
                          </p>
                        </div>
                      </div>
                    )}

                  {buffer && (
                    <div className="timetable-row buffer-row">
                      <time>{formatDuration(buffer.minutes)}</time>
                      <span className="timetable-marker" aria-hidden="true" />
                      <div>
                        <span>
                          {index === activeActivities.length - 1
                            ? "RESET"
                            : "TRANSFER"}
                        </span>
                        <strong>{buffer.title}</strong>
                        <p>{buffer.detail}</p>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}

            <div className="timetable-row dinner-row">
              <time>9:00 PM</time>
              <span className="timetable-marker" aria-hidden="true" />
              <div>
                <span>
                  CHAPTER {String(activeActivities.length + 1).padStart(2, "0")}
                </span>
                <strong>
                  {currentReview.dinnerChoice
                    ? dinnerLabels[currentReview.dinnerChoice]
                    : "Choose dinner above"}
                </strong>
                <p>
                  {currentReview.dinnerChoice
                    ? "Birthday dinner · final reservation follows"
                    : "One last decision and this cut is complete."}
                </p>
              </div>
            </div>
          </div>

          <div className="summary-prelude selected-cut">
            <span>YOUR SELECTED CUT</span>
            <div>
              <strong>
                {activeActivities
                  .map((activity) => activity.shortName)
                  .join(" · ")}
              </strong>
              <p>
                {currentReview.dinnerChoice
                  ? `Finishing at ${dinnerLabels[currentReview.dinnerChoice]}`
                  : "Dinner still needs your vote"}
              </p>
            </div>
          </div>

          <label className="note-field">
            <span>Anything else?</span>
            <textarea
              value={currentReview.note}
              onChange={(event) =>
                updateCurrentReview((review) => ({
                  ...review,
                  note: event.target.value,
                }))
              }
              placeholder="Move a time, change the energy, add a dress-code request…"
              rows={4}
            />
          </label>

          <div className="summary-actions">
            <button className="copy-button" type="button" onClick={copyReview}>
              {copied ? "Copied — send it to Erfan" : "Copy my timetable"}
              <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
            </button>
            <button className="reset-button" type="button" onClick={resetReview}>
              Reset to proposed day
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
