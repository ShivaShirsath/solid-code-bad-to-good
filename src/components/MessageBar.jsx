import React from 'react';

export default function MessageBar({ message }) {
  if (!message) return null;
  return <p className="message">{message}</p>;
}
