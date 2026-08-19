import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toast } from "sonner";
import {
  devicesSeed,
  journeySeed,
  notificationsSeed,
  scheduleSeed,
  user,
  vehicleSeed,
  weather,
} from "@/data/mock";

const STORAGE_KEY = "aura.state.v1";

const initialState = {
  user,
  weather,
  vehicle: vehicleSeed,
  schedule: scheduleSeed,
  journey: journeySeed,
  notifications: notificationsSeed,
  devices: devicesSeed,
  dayStarted: false,
  chargingScheduled: false,
  pendingAction: null,
  assistant: {
    state: "idle", // idle | listening | processing | responding | error
    transcript: "",
    messages: [
      {
        id: "m0",
        role: "aura",
        text: "Good morning, Arjun. Traffic is heavier than usual — leaving at 08:12 keeps you on time.",
      },
    ],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };
    case "PATCH_VEHICLE":
      return { ...state, vehicle: { ...state.vehicle, ...action.payload } };
    case "PATCH_JOURNEY":
      return { ...state, journey: { ...state.journey, ...action.payload } };
    case "SET_PENDING":
      return { ...state, pendingAction: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 12),
      };
    case "READ_NOTIFICATIONS":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, unread: false })),
      };
    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case "SET_ASSISTANT":
      return { ...state, assistant: { ...state.assistant, ...action.payload } };
    case "ADD_MESSAGE":
      return {
        ...state,
        assistant: {
          ...state.assistant,
          messages: [...state.assistant.messages, action.payload],
        },
      };
    case "START_DAY":
      return { ...state, dayStarted: true };
    case "SCHEDULE_CHARGING":
      return { ...state, chargingScheduled: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const AuraContext = createContext(null);

export function AuraProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // hydrate persisted demo state
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({
          type: "HYDRATE",
          payload: {
            vehicle: { ...vehicleSeed, ...(parsed.vehicle || {}) },
            journey: { ...journeySeed, ...(parsed.journey || {}) },
            dayStarted: Boolean(parsed.dayStarted),
            chargingScheduled: Boolean(parsed.chargingScheduled),
          },
        });
      }
    } catch (e) {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          vehicle: state.vehicle,
          journey: state.journey,
          dayStarted: state.dayStarted,
          chargingScheduled: state.chargingScheduled,
        })
      );
    } catch (e) {
      /* noop */
    }
  }, [state.vehicle, state.journey, state.dayStarted, state.chargingScheduled]);

  const notify = useCallback((payload) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: `n-${Date.now()}-${Math.round(Math.random() * 999)}`,
        time: "Just now",
        unread: true,
        ...payload,
      },
    });
  }, []);

  /** Simulated command pipeline: pending -> success, mirrored to every device. */
  const runAction = useCallback(
    (id, { patch, toastText, notification, delay = 900 } = {}) => {
      dispatch({ type: "SET_PENDING", payload: id });
      return new Promise((resolve) => {
        window.setTimeout(() => {
          if (patch) dispatch({ type: "PATCH_VEHICLE", payload: patch });
          dispatch({ type: "SET_PENDING", payload: null });
          if (toastText) {
            toast.success(toastText, {
              description: "Synced to vehicle, phone and watch",
            });
          }
          if (notification) notify(notification);
          resolve(true);
        }, delay);
      });
    },
    [notify]
  );

  const api = useMemo(
    () => ({
      state,
      dispatch,
      notify,
      runAction,
      lock: () =>
        runAction("lock", {
          patch: { locked: true, status: "Ready" },
          toastText: "Vehicle locked",
          notification: { title: "Vehicle locked", body: "AURA E7 secured in Koramangala.", kind: "vehicle" },
        }),
      unlock: () =>
        runAction("unlock", {
          patch: { locked: false, status: "Unlocked" },
          toastText: "Vehicle unlocked",
          notification: { title: "Vehicle unlocked", body: "Will re-lock in 3 minutes if no door opens.", kind: "vehicle" },
        }),
      toggleClimate: () => {
        const on = !state.vehicle.climateOn;
        return runAction("climate", {
          patch: { climateOn: on, cabinTemp: on ? 22 : state.vehicle.outsideTemp },
          toastText: on ? "Climate started · 22°C" : "Climate stopped",
          notification: on
            ? { title: "Cabin preconditioning", body: "Comfortable in about 6 minutes.", kind: "vehicle" }
            : null,
          delay: 1200,
        });
      },
      toggleLights: () =>
        runAction("lights", {
          patch: { lightsOn: !state.vehicle.lightsOn },
          toastText: state.vehicle.lightsOn ? "Lights off" : "Lights flashing",
          delay: 700,
        }),
      locate: () =>
        runAction("locate", {
          toastText: "Vehicle located · Koramangala 5th Block",
          delay: 1100,
        }),
      toggleTrunk: () =>
        runAction("trunk", {
          patch: { trunkOpen: !state.vehicle.trunkOpen },
          toastText: state.vehicle.trunkOpen ? "Trunk closed" : "Trunk open",
          delay: 1000,
        }),
      toggleCharge: () => {
        const on = !state.vehicle.charging;
        return runAction("charge", {
          patch: { charging: on, plugged: on },
          toastText: on ? "Charging started · 180 kW" : "Charging stopped",
          notification: on
            ? { title: "Charging started", body: "80% in 18 minutes · AURA Hub Koramangala.", kind: "charging" }
            : null,
          delay: 1200,
        });
      },
      setClimateTemp: (t) => dispatch({ type: "PATCH_VEHICLE", payload: { cabinTemp: t } }),
      setChargeLimit: (v) => dispatch({ type: "PATCH_VEHICLE", payload: { chargeLimit: v } }),
      startDay: () => {
        dispatch({ type: "START_DAY" });
        dispatch({ type: "PATCH_VEHICLE", payload: { climateOn: true, cabinTemp: 22, status: "Ready · Day started" } });
        toast.success("Your day is running", { description: "Route loaded, cabin preconditioning, watch updated" });
        notify({ title: "Leave in 8 min", body: "Route to Aura Labs is on your phone and watch.", kind: "schedule", cta: "Start navigation" });
      },
      scheduleCharging: () => {
        dispatch({ type: "SCHEDULE_CHARGING" });
        toast.success("Charging scheduled for 23:30", { description: "Off-peak tariff · target 90%" });
        notify({ title: "Charging scheduled", body: "23:30 tonight at home wallbox · target 90%.", kind: "charging" });
      },
      sendToVehicle: () => {
        dispatch({ type: "PATCH_JOURNEY", payload: { sent: true } });
        toast.success("Route sent to AURA E7", { description: "Also available on phone and watch" });
        notify({ title: "Route ready on your phone", body: "Aura Labs · 34 min · leave by 08:12.", kind: "journey", cta: "Open on phone" });
      },
    }),
    [state, runAction, notify]
  );

  return <AuraContext.Provider value={api}>{children}</AuraContext.Provider>;
}

export function useAura() {
  const ctx = useContext(AuraContext);
  if (!ctx) throw new Error("useAura must be used inside AuraProvider");
  return ctx;
}
