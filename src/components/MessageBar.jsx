// components/MessageBar.jsx
import React from "react";

export default function MessageBar({ message }) {
  return (
    <p className="message">
      {message}
    </p>
  );
}