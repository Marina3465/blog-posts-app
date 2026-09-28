import { useEffect, useState } from "react";
import { coreInstance } from "@/shared/api";

// Кнопку Google показываем только если на бэкенде заданы ключи,
// иначе клик уводил бы на 503
export const useAuthProviders = () => {
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);

  useEffect(() => {
    coreInstance
      .get<{ google: boolean }>("/auth/providers")
      .then((response) => setIsGoogleEnabled(response.data.google))
      .catch(() => setIsGoogleEnabled(false));
  }, []);

  return { isGoogleEnabled };
};
