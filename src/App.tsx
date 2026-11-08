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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("mnq_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("mnq_users", JSON.stringify(users));
  }, [users]);

  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setToastMsg("Browser ini tidak mendukung fitur suara Text-To-Speech.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  }, []);

  const stopSpeak = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

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

  const handleUpdateUser = (updated: UserProfile, toastMessage?: string) => {
    setCurrentUser(updated);
    localStorage.setItem("mnq_current_user", JSON.stringify(updated));
    setUsers((prev) =>
      prev.map((u) => (u.phone === updated.phone ? updated : u))
    );
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
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateCsWhatsApp={handleUpdateCsWhatsApp}
          onCopyText={copyText}
          onSpeak={speakText}
          onLogout={handleLogout}
        />
      ) : (
        <CustomerScreen
          currentUser={currentUser}
          orders={orders}
          csWhatsApp={csWhatsApp}
          ttsEnabled={ttsEnabled}
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
