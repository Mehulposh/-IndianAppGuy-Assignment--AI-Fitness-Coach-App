import { useState, useEffect } from "react";

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    try {
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      console.error("Failed to parse local storage key", key, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useStickyState;
