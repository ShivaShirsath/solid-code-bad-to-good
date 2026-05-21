/**
 * StatusMessage.jsx
 *
 * S — Single Responsibility: only displays a status/feedback message.
 *     Nothing else lives here.
 */

import React from "react";

/**
 * @param {{ text: string }} props
 */
export default function StatusMessage({ text }) {
  if (!text) return null;
  return <p className="message">{text}</p>;
}
