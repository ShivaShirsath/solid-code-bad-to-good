import React from "react";

/**
 * A beautiful floating toast notification component.
 * 
 * @param {Object} props
 * @param {Object} props.toast - Toast state object { type, message }
 * @param {function} props.onClose - Action to manually clear toast
 */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type, message } = toast;
  
  return (
    <div className={`toast-container ${type}`} onClick={onClose} role="alert">
      <div className="toast-icon">
        {type === "success" && "✓"}
        {type === "error" && "✗"}
        {type === "info" && "ℹ"}
      </div>
      <div className="toast-content">
        <p className="toast-text">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close alert">
        ×
      </button>
    </div>
  );
}
