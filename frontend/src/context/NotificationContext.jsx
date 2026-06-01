import { createContext, useContext, useState, useCallback, useRef } from "react";
import { FaSmile, FaBookOpen } from "react-icons/fa";

const NotificationContext = createContext(null);

// localStorage keys
const MOOD_KEY = "notif_mood_checkin";
const JOURNAL_KEY = "notif_journal";

function getStoredPref(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === "true";
  } catch {
    return defaultValue;
  }
}

let toastIdCounter = 0;

export function NotificationProvider({ children }) {
  // Notification preferences
  const [moodNotifEnabled, setMoodNotifEnabled] = useState(() =>
    getStoredPref(MOOD_KEY, true)
  );
  const [journalNotifEnabled, setJournalNotifEnabled] = useState(() =>
    getStoredPref(JOURNAL_KEY, true)
  );

  // Active toasts
  const [toasts, setToasts] = useState([]);

  // Track if we already showed notifications this page session
  const hasNotifiedRef = useRef(false);

  const toggleMoodNotif = useCallback((val) => {
    setMoodNotifEnabled(val);
    localStorage.setItem(MOOD_KEY, String(val));
  }, []);

  const toggleJournalNotif = useCallback((val) => {
    setJournalNotifEnabled(val);
    localStorage.setItem(JOURNAL_KEY, String(val));
  }, []);

  const showToast = useCallback((toast) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Check if user has written a journal today.
   * If not, show appropriate toast reminders based on preferences.
   * @param {Array} journalEntries - list of journal entries from the API
   * @param {Function} navigateFn - react-router navigate function
   */
  const checkAndNotify = useCallback(
    (journalEntries, navigateFn) => {
      // Only show once per app session
      if (hasNotifiedRef.current) return;

      const today = new Date().toDateString();
      const hasJournalToday = Array.isArray(journalEntries) && journalEntries.some(
        (e) => new Date(e.createdAt).toDateString() === today
      );

      if (hasJournalToday) return; // Already journaled today, no reminder needed

      hasNotifiedRef.current = true;

      if (moodNotifEnabled) {
        showToast({
          icon: <FaSmile />,
          iconClass: "toast-icon-mood",
          title: "Pengingat Mood Check-in",
          description:
            "Kamu belum mencatat mood hari ini. Yuk, luangkan sebentar untuk cek perasaanmu!",
          action: {
            label: "Catat Mood",
            onClick: () => navigateFn("/journal"),
          },
        });
      }

      if (journalNotifEnabled) {
        showToast({
          icon: <FaBookOpen />,
          iconClass: "toast-icon-journal",
          title: "Pengingat Jurnal Harian",
          description:
            "Belum ada jurnal hari ini. Tuangkan pikiranmu ke dalam tulisan!",
          action: {
            label: "Tulis Jurnal",
            onClick: () => navigateFn("/journal"),
          },
        });
      }
    },
    [moodNotifEnabled, journalNotifEnabled, showToast]
  );

  return (
    <NotificationContext.Provider
      value={{
        moodNotifEnabled,
        journalNotifEnabled,
        toggleMoodNotif,
        toggleJournalNotif,
        toasts,
        showToast,
        dismissToast,
        checkAndNotify,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
}
