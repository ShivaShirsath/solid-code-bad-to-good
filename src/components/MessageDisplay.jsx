import React from "react";

export default function MessageDisplay({ message }) {
  if (!message) return null;

  return (
    <p className="message" style={{ animation: "fadeIn 0.3s" }}>
      {message}
    </p>
  );
}
