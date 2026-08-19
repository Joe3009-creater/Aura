import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin wrapper around the browser Web Speech APIs.
 * Degrades gracefully: when SpeechRecognition is missing, `supported` is false
 * and the UI falls back to typed input.
 */
export function useVoice({ onResult, onError } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [level, setLevel] = useState(0);

  const SR =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
  const supported = Boolean(SR);
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // simulated mic level for the waveform (works with or without mic access)
  useEffect(() => {
    if (!listening) {
      setLevel(0);
      return;
    }
    let raf;
    const tick = () => {
      setLevel(0.35 + Math.random() * 0.65);
      raf = window.setTimeout(tick, 90);
    };
    tick();
    return () => window.clearTimeout(raf);
  }, [listening]);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      /* noop */
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!supported) {
      onError?.("unsupported");
      return false;
    }
    try {
      const rec = new SR();
      rec.lang = "en-IN";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setListening(true);
      rec.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const res = event.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interimText += res[0].transcript;
        }
        setInterim(interimText);
        if (finalText.trim()) {
          setInterim("");
          setListening(false);
          onResult?.(finalText.trim());
        }
      };
      rec.onerror = (event) => {
        setListening(false);
        onError?.(event?.error || "error");
      };
      rec.onend = () => setListening(false);

      recognitionRef.current = rec;
      rec.start();
      return true;
    } catch (e) {
      setListening(false);
      onError?.("error");
      return false;
    }
  }, [SR, supported, onResult, onError]);

  const speak = useCallback(
    (text) => {
      if (!ttsSupported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.rate = 1.02;
        utter.pitch = 1;
        utter.lang = "en-IN";
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
      } catch (e) {
        setSpeaking(false);
      }
    },
    [ttsSupported]
  );

  const cancelSpeech = useCallback(() => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [ttsSupported]);

  useEffect(() => () => {
    try {
      recognitionRef.current?.abort();
      if (ttsSupported) window.speechSynthesis.cancel();
    } catch (e) {
      /* noop */
    }
  }, [ttsSupported]);

  return {
    supported,
    ttsSupported,
    listening,
    interim,
    speaking,
    level,
    start,
    stop,
    speak,
    cancelSpeech,
  };
}
