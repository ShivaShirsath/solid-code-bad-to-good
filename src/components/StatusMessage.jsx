/**
 * StatusMessage — tiny presentational component.
 *
 * SRP: renders a status/feedback message.  Nothing else.
 */

import React from "react";

export default function StatusMessage({ message }) {
  if (!message) return null;
  return <p className="message">{message}</p>;
}
