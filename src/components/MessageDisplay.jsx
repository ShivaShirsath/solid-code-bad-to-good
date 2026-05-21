import React from "react";

export function MessageDisplay({ message }) {
  if (!message) return null;
  return <p className="message">{message}</p>;
}
