import { useEffect } from "react";
import { warmBackend } from "../api/axiosClient.js"; // adjust path if needed

export default function AppInit() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await warmBackend();
    })();
    return () => { cancelled = true; };
  }, []);
  return null;
}
