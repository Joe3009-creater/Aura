// AURA intent engine — deterministic, offline, mock "AI".
// Replaceable by a real LLM endpoint: same signature, async in / message out.

import { chargers, tomorrowSchedule, weather } from "@/data/mock";

const has = (text, words) => words.some((w) => text.includes(w));

export function resolveIntent(rawInput, ctx) {
  const text = (rawInput || "").toLowerCase().trim();
  const { vehicle, schedule, journey } = ctx;
  const next = schedule.find((e) => e.kind !== "depart") || schedule[0];

  if (!text) {
    return { text: "Sorry, I didn't catch that.", error: true };
  }

  if (has(text, ["battery", "charge level", "range", "how far"])) {
    return {
      text: `You have ${vehicle.battery}% charge, about ${vehicle.range} km of range. That covers today's ${schedule.length} stops with roughly ${Math.max(
        0,
        vehicle.battery - 21
      )}% left when you get home.`,
      chips: ["Find a charger", "Schedule charging"],
    };
  }

  if (has(text, ["locked", "lock status", "is my car secure"]) && !has(text, ["unlock"])) {
    return {
      text: vehicle.locked
        ? `Yes — your ${vehicle.name} is locked and parked in ${vehicle.location}. Cabin is ${vehicle.cabinTemp}°C.`
        : `Your ${vehicle.name} is currently unlocked in ${vehicle.location}. Want me to lock it?`,
      action: vehicle.locked ? null : { type: "lock", label: "Lock vehicle" },
    };
  }

  if (has(text, ["lock the car", "lock my car", "lock it"])) {
    return { text: "Locking your vehicle now.", action: { type: "lock", label: "Locked", auto: true } };
  }

  if (has(text, ["unlock"])) {
    return { text: "Unlocked. I'll re-lock automatically in 3 minutes if no door opens.", action: { type: "unlock", auto: true } };
  }

  if (has(text, ["plan my day", "my day", "start my day", "day plan"])) {
    return {
      text: `You have ${schedule.length} stops today, starting with ${next.title} at ${next.time}. Traffic is heavier than usual, so leave at 08:12 to arrive by 08:46. Battery at ${vehicle.battery}% is enough — no charging stop needed before tonight.`,
      chips: ["Start my day", "Send to vehicle"],
      action: { type: "openDay", label: "Open day planner" },
    };
  }

  if (has(text, ["next appointment", "next meeting", "what's next", "whats next"])) {
    return {
      text: `${next.title} at ${next.time}, ${next.place}. It's ${next.distance} away — I'd leave by 08:12.`,
      chips: ["Take me there", "Precondition the cabin"],
    };
  }

  if (has(text, ["charger", "charging station", "find a charge"])) {
    const c = chargers[0];
    return {
      text: `Closest is ${c.name}, ${c.distance} away. ${c.power}, ${c.available} bays free at ${c.price} — about ${c.eta}.`,
      chips: ["Send to Vehicle", "Schedule charging"],
      action: { type: "openCharging", label: "Open charging" },
    };
  }

  if (has(text, ["how long", "eta", "office", "get to work", "commute time"])) {
    return {
      text: `${journey.duration} minutes to ${journey.to} right now — that's ${journey.trafficDelta} minutes more than usual. Leaving at ${journey.depart} gets you there by ${journey.arrive}.`,
      chips: ["Send to Vehicle"],
      action: { type: "openJourney", label: "Open journey" },
    };
  }

  if (has(text, ["precondition", "climate", "cabin", "air con", "heat", "cool"])) {
    return {
      text: `Preconditioning to 22°C. It's ${weather.temp}°C outside — cabin will be comfortable in about 6 minutes.`,
      action: { type: "climateOn", auto: true },
    };
  }

  if (has(text, ["remind me to charge", "remind me", "tonight"])) {
    return {
      text: "Done. I'll remind you at 22:45 and start charging at 23:30 when the off-peak tariff begins.",
      action: { type: "scheduleCharging", auto: true },
    };
  }

  if (has(text, ["take me home", "navigate home", "drive home"])) {
    return {
      text: "Route home set — 7.2 km, 21 minutes via 100 Ft Road. Sending it to your vehicle and your phone.",
      action: { type: "sendHome", auto: true },
    };
  }

  if (has(text, ["tomorrow"])) {
    return {
      text: `Tomorrow you have ${tomorrowSchedule.length} commitments: ${tomorrowSchedule
        .map((t) => `${t.title} at ${t.time}`)
        .join(", ")}. The airport drop needs a full battery, so I'd charge tonight.`,
      chips: ["Schedule charging"],
    };
  }

  if (has(text, ["morning commute", "prepare my car", "get my car ready", "ready my car"])) {
    return {
      text: "I'll have your E7 ready for 08:12 — cabin at 22°C, seat heater off, route to Aura Labs loaded and a podcast queued.",
      action: { type: "prepareMorning", auto: true },
    };
  }

  if (has(text, ["weather", "rain"])) {
    return {
      text: `${weather.condition}, ${weather.temp}°C with a high of ${weather.high}°C. ${weather.rainChance}% chance of rain around your gym slot — I'd keep the windows closed.`,
    };
  }

  if (has(text, ["hello", "hey aura", "hi", "good morning"])) {
    return { text: "Good morning, Arjun. Your E7 is ready and your day is on track. What would you like to do?", chips: ["Plan my day", "Is my car locked?"] };
  }

  return {
    text: "I can help with your vehicle, your schedule, charging and navigation. Try asking about your battery, your next appointment, or say \u201cplan my day\u201d.",
    chips: ["Plan my day", "How much battery do I have?", "Find a charger"],
  };
}
