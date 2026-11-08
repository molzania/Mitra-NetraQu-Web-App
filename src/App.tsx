/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  DEFAULT_CS_WHATSAPP,
  INITIAL_USERS,
  OrderRecord,
  OrderStatusCode,
  UserProfile,
  getInitialOrders,
  getStatusObj
} from "./data/constants";
import { AuthScreen } from "./components/AuthScreen";
import { CustomerScreen } from "./components/CustomerScreen";
import { AdminScreen } from "./components/AdminScreen";

export default function App() {
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem("mnq_orders");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    const todayIso = new Date().toISOString().split("T")[0];
    const seed = getInitialOrders(todayIso);
    localStorage.setItem("mnq_orders", JSON.stringify(seed));
    return seed;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem("mnq_users");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    localStorage.setItem("mnq_users", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("mnq_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [csWhatsApp, setCsWhatsApp] = useState<string>(() => {
    return localStorage.getItem("mnq_cs_wa") || DEFAULT_CS_WHATSAPP;
  });

  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [ttsGender, setTtsGender] = useState<"pria" | "wanita">(() => {
    const saved = localStorage.getItem("mnq_tts_gender");
    return saved === "pria" || saved === "wanita" ? saved : "pria";
  });
  const [ttsSpeed, setTtsSpeed] = useState<"lambat" | "sedang" | "cepat">(() => {
    const saved = localStorage.getItem("mnq_tts_speed");
    return saved === "lambat" || saved === "sedang" || saved === "cepat"
      ? saved
      : "sedang";
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const ttsAbortRef = React.useRef<AbortController | null>(null);
  const audioCacheRef = React.useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("mnq_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("mnq_users", JSON.stringify(users));
  }, [users]);

  const stopSpeak = useCallback(() => {
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const getPlaybackRateValue = (speed: "lambat" | "sedang" | "cepat"): number => {
    if (speed === "lambat") return 0.78;
    if (speed === "cepat") return 1.28;
    return 1.0;
  };

  const speakBrowserFallback = useCallback(
    (
      text: string,
      activeGender: "pria" | "wanita",
      activeSpeed: "lambat" | "sedang" | "cepat"
    ) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "id-ID";

      const voices =
        availableVoices.length > 0
          ? availableVoices
          : window.speechSynthesis.getVoices();

      const idVoices = voices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith("id") ||
          v.lang.toLowerCase().includes("ind") ||
          v.name.toLowerCase().includes("indonesia")
      );

      const maleKeywords = [
        "ardi",
        "male",
        "pria",
        "laki",
        "budi",
        "andika",
        "rizky",
        "david",
        "daniel",
        "guy",
        "alex"
      ];
      const femaleKeywords = [
        "gadis",
        "damayanti",
        "female",
        "wanita",
        "perempuan",
        "siti",
        "zira",
        "samantha"
      ];

      let chosenVoice: SpeechSynthesisVoice | undefined;
      let hasDedicatedMaleVoice = false;

      if (activeGender === "pria") {
        chosenVoice = idVoices.find((v) =>
          maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
        );
        if (chosenVoice) {
          hasDedicatedMaleVoice = true;
        } else if (idVoices.length > 1) {
          const nonFemale = idVoices.find(
            (v) => !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
          );
          chosenVoice = nonFemale || idVoices[0];
        } else {
          chosenVoice = idVoices[0];
        }
      } else {
        chosenVoice =
          idVoices.find((v) =>
            femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
          ) || idVoices[0];
      }

      if (chosenVoice) {
        utter.voice = chosenVoice;
      }

      const speedFactor = getPlaybackRateValue(activeSpeed);

      if (activeGender === "pria") {
        utter.pitch = hasDedicatedMaleVoice ? 0.82 : 0.72;
        utter.rate = Number((0.92 * speedFactor).toFixed(2));
      } else {
        utter.pitch = 1.1;
        utter.rate = Number((1.0 * speedFactor).toFixed(2));
      }

      window.speechSynthesis.speak(utter);
    },
    [availableVoices]
  );

  const speakText = useCallback(
    async (
      text: string,
      genderOverride?: "pria" | "wanita",
      speedOverride?: "lambat" | "sedang" | "cepat"
    ) => {
      const activeGender = genderOverride || ttsGender;
      const activeSpeed = speedOverride || ttsSpeed;
      const playbackRate = getPlaybackRateValue(activeSpeed);
      stopSpeak();

      const cacheKey = `${activeGender}::${text.trim()}`;
      const cachedDataUrl = audioCacheRef.current.get(cacheKey);
      if (cachedDataUrl) {
        try {
          const audio = new Audio(cachedDataUrl);
          audio.playbackRate = playbackRate;
          activeAudioRef.current = audio;
          await audio.play();
          return;
        } catch {
          // fall through if audio playback failed
        }
      }

      const controller = new AbortController();
      ttsAbortRef.current = controller;

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim(), gender: activeGender }),
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error("TTS API error");
        }

        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };

        if (controller.signal.aborted) return;

        if (data.audioBase64) {
          const mime = data.mimeType || "audio/wav";
          const dataUrl = `data:${mime};base64,${data.audioBase64}`;
          audioCacheRef.current.set(cacheKey, dataUrl);
          const audio = new Audio(dataUrl);
          audio.playbackRate = playbackRate;
          activeAudioRef.current = audio;
          await audio.play();
          return;
        }
        throw new Error("Empty audio");
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        speakBrowserFallback(text, activeGender, activeSpeed);
      }
    },
    [ttsGender, ttsSpeed, stopSpeak, speakBrowserFallback]
  );

  const handleChangeTtsGender = useCallback(
    (newGender: "pria" | "wanita") => {
      setTtsGender(newGender);
      localStorage.setItem("mnq_tts_gender", newGender);
      const msg =
        newGender === "pria"
          ? "suara diubah menjadi suara pria"
          : "suara diubah menjadi suara wanita";
      setToastMsg(msg);
      speakText(msg, newGender, ttsSpeed);
    },
    [speakText, ttsSpeed]
  );

  const handleChangeTtsSpeed = useCallback(
    (newSpeed: "lambat" | "sedang" | "cepat") => {
      setTtsSpeed(newSpeed);
      localStorage.setItem("mnq_tts_speed", newSpeed);
      const msg = `kecepatan suara diubah menjadi ${newSpeed}`;
      setToastMsg(msg);
      speakText(msg, ttsGender, newSpeed);
    },
    [speakText, ttsGender]
  );

  const showToast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      if (ttsEnabled) {
        speakText(msg);
      }
    },
    [ttsEnabled, speakText]
  );

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => {
      setToastMsg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const copyText = useCallback(
    (text: string, label = "Teks") => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`${label} berhasil disalin ke clipboard`);
        });
      } else {
        showToast(`${label}: ${text}`);
      }
    },
    [showToast]
  );

  const handleLoginSuccess = (user: UserProfile, welcomeMessage: string) => {
    setCurrentUser(user);
    localStorage.setItem("mnq_current_user", JSON.stringify(user));
    showToast(welcomeMessage);
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setUsers((prev) => {
      const filtered = prev.filter((u) => u.phone !== newUser.phone);
      return [newUser, ...filtered];
    });
    setCurrentUser(newUser);
    localStorage.setItem("mnq_current_user", JSON.stringify(newUser));
    showToast("Pendaftaran berhasil! Selamat datang, " + newUser.fullName);
  };

  const handleCreateOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast("Pesanan " + newOrder.orderId + " berhasil dibuat!");
  };

  const handleUpdateUser = (
    updated: UserProfile,
    toastMessage?: string,
    previousPhone?: string
  ) => {
    const matchPhone = previousPhone || updated.phone;
    setCurrentUser(updated);
    localStorage.setItem("mnq_current_user", JSON.stringify(updated));
    setUsers((prev) =>
      prev.map((u) => (u.phone === matchPhone ? updated : u))
    );
    if (previousPhone && previousPhone !== updated.phone) {
      setOrders((prev) =>
        prev.map((o) =>
          o.customerPhone === previousPhone
            ? {
                ...o,
                customerPhone: updated.phone,
                customerName: updated.fullName
              }
            : o
        )
      );
    }
    if (toastMessage) {
      showToast(toastMessage);
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatusCode
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    const st = getStatusObj(newStatus);
    showToast(`Status pesanan ${orderId} diubah menjadi: ${st.label}`);
  };

  const handleUpdateCsWhatsApp = (newWa: string) => {
    setCsWhatsApp(newWa);
    localStorage.setItem("mnq_cs_wa", newWa);
    showToast("Nomor WhatsApp CS berhasil diperbarui menjadi " + newWa);
  };

  const handleLogout = () => {
    stopSpeak();
    localStorage.removeItem("mnq_current_user");
    setCurrentUser(null);
    showToast("Anda telah keluar dari akun");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      {!currentUser ? (
        <AuthScreen
          users={users}
          ttsGender={ttsGender}
          ttsSpeed={ttsSpeed}
          onChangeTtsGender={handleChangeTtsGender}
          onChangeTtsSpeed={handleChangeTtsSpeed}
          onLoginSuccess={handleLoginSuccess}
          onRegisterUser={handleRegisterUser}
          onShowToast={showToast}
          onSpeak={speakText}
          onStopSpeak={stopSpeak}
        />
      ) : currentUser.isAdmin ? (
        <AdminScreen
          orders={orders}
          users={users}
          csWhatsApp={csWhatsApp}
          ttsGender={ttsGender}
          ttsSpeed={ttsSpeed}
          onChangeTtsGender={handleChangeTtsGender}
          onChangeTtsSpeed={handleChangeTtsSpeed}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateCsWhatsApp={handleUpdateCsWhatsApp}
          onCopyText={copyText}
          onSpeak={speakText}
          onStopSpeak={stopSpeak}
          onLogout={handleLogout}
        />
      ) : (
        <CustomerScreen
          currentUser={currentUser}
          orders={orders}
          csWhatsApp={csWhatsApp}
          ttsEnabled={ttsEnabled}
          ttsGender={ttsGender}
          ttsSpeed={ttsSpeed}
          onChangeTtsGender={handleChangeTtsGender}
          onChangeTtsSpeed={handleChangeTtsSpeed}
          onToggleTts={() => {
            const next = !ttsEnabled;
            setTtsEnabled(next);
            setToastMsg(
              next
                ? "Suara pembaca layar otomatis diaktifkan"
                : "Suara pembaca layar otomatis dinonaktifkan"
            );
          }}
          onSpeak={speakText}
          onStopSpeak={stopSpeak}
          onCopyText={copyText}
          onCreateOrder={handleCreateOrder}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#0D5C91] border-2 border-[#4C9A2A] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-bold z-50 transition-all max-w-[90vw] text-center"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
