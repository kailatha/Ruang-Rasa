import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./toast.css";

/**
 * Toast item component — individual notification popup.
 */
function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 8000);

    return () => clearTimeout(timerRef.current);
  }, [handleDismiss, toast.duration]);

  return (
    <div className={`toast-item ${exiting ? "toast-exit" : ""}`}>
      {toast.icon && (
        <div className={`toast-icon ${toast.iconClass || ""}`}>
          {toast.icon}
        </div>
      )}
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        {toast.description && (
          <div className="toast-desc">{toast.description}</div>
        )}
        {toast.action && (
          <div className="toast-actions">
            <button className="toast-action-btn" onClick={toast.action.onClick}>
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      <button className="toast-dismiss-btn" onClick={handleDismiss}>
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * ToastContainer — renders all active toasts.
 * Should be placed once at the top level of the app (e.g., in App.jsx).
 */
export function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
