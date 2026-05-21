import { useState, useEffect } from "react";
import { MESSAGE_DURATION } from "../constants";

export function useMessage() {
  const [message, setMessage] = useState("");

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return [message, setMessage];
}
