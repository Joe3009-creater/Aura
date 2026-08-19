import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  AudioLines,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceVisualizer } from "@/components/aura/VoiceVisualizer";
import { CardLabel } from "@/components/aura/GlassCard";
import { useVoice } from "@/hooks/useVoice";
import { useAura } from "@/state/AuraContext";
import { resolveIntent } from "@/lib/assistant";
import { suggestionChips } from "@/data/mock";
import { cn } from "@/lib/utils";

const STATE_COPY = {
  idle: "Ask AURA",
  listening: "I'm listening\u2026",
  processing: "Thinking\u2026",
  responding: "AURA is speaking",
  error: "Sorry, I didn't catch that.",
};

export const AssistantPanel = ({
  className,
  variant = "panel", // panel | full
  chipCount = 4,
  onClose,
}) => {
  const navigate = useNavigate();
  const { state, dispatch, lock, unlock, toggleClimate, scheduleCharging, sendToVehicle, startDay } =
    useAura();
  const assistant = state.assistant;
  const [draft, setDraft] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);
  const listRef = useRef(null);

  const setAssistant = useCallback(
    (payload) => dispatch({ type: "SET_ASSISTANT", payload }),
    [dispatch]
  );

  const performAction = useCallback(
    (action) => {
      if (!action) return;
      switch (action.type) {
        case "lock":
          lock();
          break;
        case "unlock":
          unlock();
          break;
        case "climateOn":
          if (!state.vehicle.climateOn) toggleClimate();
          break;
        case "scheduleCharging":
          scheduleCharging();
          break;
        case "sendHome":
          sendToVehicle();
          break;
        case "prepareMorning":
          startDay();
          break;
        case "openDay":
          navigate("/");
          break;
        case "openJourney":
          navigate("/journey");
          break;
        case "openCharging":
          navigate("/vehicle?tab=charging");
          break;
        default:
          break;
      }
    },
    [lock, unlock, toggleClimate, scheduleCharging, sendToVehicle, startDay, navigate, state.vehicle.climateOn]
  );

  const handleQuery = useCallback(
    (text) => {
      const clean = (text || "").trim();
      if (!clean) {
        setAssistant({ state: "error", transcript: "" });
        return;
      }
      dispatch({
        type: "ADD_MESSAGE",
        payload: { id: `u-${Date.now()}`, role: "user", text: clean },
      });
      setAssistant({ state: "processing", transcript: clean });

      window.setTimeout(() => {
        const reply = resolveIntent(clean, state);
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: `a-${Date.now()}`,
            role: "aura",
            text: reply.text,
            chips: reply.chips,
            action: reply.action && !reply.action.auto ? reply.action : null,
          },
        });
        setAssistant({ state: reply.error ? "error" : "responding" });
        if (reply.action?.auto) performAction(reply.action);
        if (voiceOn) speak(reply.text);
        window.setTimeout(() => setAssistant({ state: "idle" }), voiceOn ? 400 : 1400);
      }, 900);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, dispatch, setAssistant, performAction, voiceOn]
  );

  const { supported, listening, interim, speaking, level, start, stop, speak, cancelSpeech } =
    useVoice({
      onResult: handleQuery,
      onError: (err) =>
        setAssistant({
          state: "error",
          transcript: err === "unsupported" ? "unsupported" : "",
        }),
    });

  useEffect(() => {
    if (listening) setAssistant({ state: "listening" });
  }, [listening, setAssistant]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [assistant.messages.length, variant]);

  const uiState = listening
    ? "listening"
    : speaking
      ? "responding"
      : assistant.state;

  const toggleMic = () => {
    if (listening) {
      stop();
      setAssistant({ state: "idle" });
      return;
    }
    cancelSpeech();
    const ok = start();
    if (!ok) {
      setAssistant({ state: "error", transcript: "unsupported" });
    }
  };

  const messages = variant === "full" ? assistant.messages : assistant.messages.slice(-3);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[28px] glass-strong",
        variant === "full" ? "h-full" : "",
        className
      )}
      aria-live="polite"
    >
      {/* header */}
      <div className="flex items-center gap-3 px-6 pt-5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">AURA Assistant</p>
          <p className="text-xs text-muted-foreground">{STATE_COPY[uiState]}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVoiceOn((v) => !v);
            cancelSpeech();
          }}
          aria-label={voiceOn ? "Mute AURA voice" : "Unmute AURA voice"}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full border border-foreground/10 transition-colors duration-300",
            voiceOn ? "bg-brand-soft text-brand-strong" : "bg-transparent text-muted-foreground"
          )}
        >
          <AudioLines className={cn("h-4 w-4", speaking && "animate-pulse")} strokeWidth={1.7} />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="grid h-8 w-8 place-items-center rounded-full border border-foreground/10 text-muted-foreground transition-colors duration-300 hover:bg-accent"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* conversation */}
      <div
        ref={listRef}
        className={cn(
          "scrollbar-none mt-4 flex-1 space-y-3 overflow-y-auto px-6",
          variant === "full" ? "flex flex-col justify-end max-h-none" : "max-h-[210px]"
        )}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-foreground/[0.08] bg-card/70 text-foreground"
                )}
              >
                {m.text}
                {m.action && (
                  <Button
                    variant="brand"
                    size="sm"
                    className="mt-3 h-8 rounded-full"
                    onClick={() => performAction(m.action)}
                  >
                    {m.action.label}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {uiState === "processing" && (
          <div className="flex items-center gap-1.5 pl-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
              />
            ))}
          </div>
        )}

        {listening && interim && (
          <p className="pl-1 text-sm italic text-muted-foreground">{interim}</p>
        )}

        {uiState === "error" && (
          <div className="flex items-center gap-3 rounded-2xl border border-foreground/[0.08] bg-card/70 px-4 py-3">
            <MicOff className="h-4 w-4 shrink-0 text-warning" strokeWidth={1.7} />
            <p className="flex-1 text-xs text-muted-foreground">
              {assistant.transcript === "unsupported"
                ? "Voice input isn't available in this browser — type your request instead."
                : "Sorry, I didn't catch that."}
            </p>
            <Button variant="quiet" size="sm" className="h-7" onClick={toggleMic}>
              <RotateCcw className="h-3 w-3" /> Try again
            </Button>
          </div>
        )}
      </div>

      {/* waveform */}
      <div className="px-6 pt-4">
        <VoiceVisualizer active={listening || speaking} level={listening ? level : 0.5} />
      </div>

      {/* suggestions */}
      <div className="scrollbar-none mt-1 flex gap-2 overflow-x-auto px-6 pb-1">
        {suggestionChips.slice(0, chipCount).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleQuery(chip)}
            className="shrink-0 rounded-full border border-foreground/10 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:bg-card hover:text-foreground"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* composer */}
      <form
        className="flex items-center gap-2 px-4 pb-4 pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery(draft);
          setDraft("");
        }}
      >
        <button
          type="button"
          onClick={toggleMic}
          aria-label={listening ? "Stop listening" : "Speak to AURA"}
          className={cn(
            "relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[background-color,transform] duration-300 ease-calm active:scale-95",
            listening
              ? "bg-primary text-primary-foreground"
              : "border border-foreground/10 bg-card/70 text-foreground hover:bg-card"
          )}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full bg-brand/30 animate-pulse-ring" />
          )}
          {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-4 w-4" strokeWidth={1.7} />}
        </button>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={supported ? "Ask AURA or hold the mic…" : "Ask AURA…"}
          aria-label="Message AURA"
          className="h-11 flex-1 rounded-full border-foreground/10 bg-card/70 px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-brand"
        />
        <Button
          type="submit"
          variant="brand"
          size="icon-lg"
          aria-label="Send message"
          className="h-11 w-11 shrink-0"
          disabled={!draft.trim()}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export const AssistantStateBadge = () => {
  const { state } = useAura();
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <CardLabel>{STATE_COPY[state.assistant.state]}</CardLabel>
    </span>
  );
};

export default AssistantPanel;
