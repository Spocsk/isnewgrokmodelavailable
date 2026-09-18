"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GrokStatus } from "@/lib/detect-grok-47";
import styles from "./plate.module.css";

const POLL_MS = 15_000;
const STORAGE_KEY = "grok47-waitlist-email";

type NotifyState = "idle" | "sending" | "saved" | "exists" | "invalid" | "error";

function formatCheckedAt(iso: string, now: number): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) {
    return "";
  }
  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 4) {
    return "just now";
  }
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 60) {
    return formatter.format(-seconds, "second");
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return formatter.format(-minutes, "minute");
  }
  return formatter.format(-Math.round(minutes / 60), "hour");
}

function answerWord(available: boolean | null): string {
  if (available === true) {
    return "YES";
  }
  if (available === false) {
    return "NO";
  }
  return "—";
}

function mergeStatus(previous: GrokStatus, incoming: GrokStatus): GrokStatus {
  if (incoming.error === null) {
    return incoming;
  }
  if (previous.available === null) {
    return incoming;
  }
  return {
    ...previous,
    error: incoming.error,
  };
}

function Rivet({ pulsing }: { pulsing: boolean }) {
  return (
    <span className={`${styles.rivet}${pulsing ? ` ${styles.rivetLive}` : ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.rivetImg} src="/plates/rivet.png" alt="" />
    </span>
  );
}

function notifyCopy(state: NotifyState): string {
  if (state === "saved" || state === "exists") {
    return "We’ll email you";
  }
  if (state === "invalid") {
    return "Enter a valid email";
  }
  if (state === "error") {
    return "Couldn’t save — try again";
  }
  return "";
}

export function Plate({ initial }: { initial: GrokStatus }) {
  const [status, setStatus] = useState<GrokStatus>(initial);
  const [now, setNow] = useState(() => Date.now());
  const [polling, setPolling] = useState(false);
  const [email, setEmail] = useState("");
  const [notifyState, setNotifyState] = useState<NotifyState>("idle");

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) {
        setNotifyState("saved");
      }
    } catch {
      // localStorage can be blocked
    }
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    let cancelled = false;

    async function pull() {
      setPolling(true);
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const payload = (await response.json()) as GrokStatus;
        if (!cancelled) {
          setStatus((previous) => mergeStatus(previous, payload));
        }
      } catch {
        if (!cancelled) {
          setStatus((previous) =>
            mergeStatus(previous, {
              available: null,
              checkedAt: new Date().toISOString(),
              source: previous.source,
              modelId: previous.modelId,
              error: "Catalogue unreachable",
            }),
          );
        }
      } finally {
        if (!cancelled) {
          setPolling(false);
        }
      }
    }

    function start() {
      void pull();
      intervalId = window.setInterval(() => {
        void pull();
      }, POLL_MS);
    }

    function stop() {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    }

    function onVisibility() {
      if (document.hidden) {
        stop();
        return;
      }
      stop();
      start();
    }

    if (!document.hidden) {
      intervalId = window.setInterval(() => {
        void pull();
      }, POLL_MS);
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  async function onNotify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (notifyState === "sending") {
      return;
    }
    setNotifyState("sending");
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        status?: "created" | "exists";
        error?: string;
      };
      if (!payload.ok || payload.error === "invalid") {
        setNotifyState(payload.error === "invalid" ? "invalid" : "error");
        return;
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
      } catch {
        // ignore
      }
      setNotifyState(payload.status === "exists" ? "exists" : "saved");
    } catch {
      setNotifyState("error");
    }
  }

  const live = status.available === true;
  const word = answerWord(status.available);
  const checkedLabel = formatCheckedAt(status.checkedAt, now);
  const announcement =
    status.available === true
      ? `Grok 4.7 is available. Checked ${checkedLabel}.`
      : status.available === false
        ? `Grok 4.7 is not available. Checked ${checkedLabel}.`
        : `Grok 4.7 status unknown. ${status.error ?? ""}`;

  const checkCopy = status.error
    ? `Catalogue unreachable${status.available !== null ? " — last known status kept" : ""}`
    : checkedLabel
      ? `Checked ${checkedLabel}`
      : "Checking";

  const saved = notifyState === "saved" || notifyState === "exists";
  const helper = notifyCopy(notifyState);

  return (
    <main className={`${styles.plate}${live ? ` ${styles.isLive}` : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.field} src="/plates/enamel-idle.png" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${styles.field} ${styles.fieldLive}`}
        src="/plates/enamel-live.png"
        alt=""
        aria-hidden="true"
      />

      <div className={styles.rivets} aria-hidden="true">
        <Rivet pulsing={false} />
        <Rivet pulsing={polling} />
        <Rivet pulsing={false} />
        <Rivet pulsing={false} />
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {announcement}
      </p>

      <div className={styles.stamp}>
        <h1 className={styles.word}>{word}</h1>
        <p className={styles.machine}>Grok 4.7</p>
      </div>

      <div className={styles.foot}>
        {!live ? (
          saved ? (
            <p className={styles.notifyNote}>We’ll email you</p>
          ) : (
            <form className={styles.notify} onSubmit={onNotify}>
              <label className={styles.srOnly} htmlFor="notify-email">
                Email for when Grok 4.7 is live
              </label>
              <input
                id="notify-email"
                className={styles.notifyInput}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="email for when it’s live"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (notifyState === "invalid" || notifyState === "error") {
                    setNotifyState("idle");
                  }
                }}
                required
              />
              <button className={styles.notifySubmit} type="submit" disabled={notifyState === "sending"}>
                {notifyState === "sending" ? "…" : "Notify"}
              </button>
            </form>
          )
        ) : null}
        {helper && !saved ? <p className={styles.notifyNote}>{helper}</p> : null}
        <p className={styles.check}>{checkCopy}</p>
      </div>
    </main>
  );
}
