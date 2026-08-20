"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthedUser {
  id: string;
  role: "CLIENT" | "TRAINER";
  firstName: string;
}

interface AuthState {
  user: AuthedUser | null;
  status: "loading" | "ready" | "error";
  errorMessage: string | null;
}

const AuthContext = createContext<AuthState>({ user: null, status: "loading", errorMessage: null });

export function useAuth() {
  return useContext(AuthContext);
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, status: "loading", errorMessage: null });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    webApp?.ready();
    webApp?.expand();

    const initData = webApp?.initData ?? "";
    // Только для локальной разработки без бота: ?as=trainer в адресной строке
    // подставляет мок-тренера вместо мок-клиента (см. api/auth/route.ts).
    const devRole = new URLSearchParams(window.location.search).get("as") ?? undefined;

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, devRole }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Ошибка авторизации");
        }
        return res.json();
      })
      .then((user: AuthedUser) => setState({ user, status: "ready", errorMessage: null }))
      .catch((err: Error) =>
        setState({ user: null, status: "error", errorMessage: err.message })
      );
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
