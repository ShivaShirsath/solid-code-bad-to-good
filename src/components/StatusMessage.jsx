import React from "react";
export default function StatusMessage({ message }) {
  if (!message) return null;
  return <p className="message">{message}</p>;
}