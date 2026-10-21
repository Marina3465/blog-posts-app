import { coreInstance } from "@/shared/api";
import { UserPreview } from "@/shared/types";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DEBOUNCE_MS = 300;

// signal позволяет отменить запрос, если пользователь уже ввел следующую букву
const searchUsers = async (query: string, signal?: AbortSignal) => {
  const response = await coreInstance.get<UserPreview[]>("/users/search", {
    params: { q: query },
    signal,
  });

  return response.data;
};

type Status = "idle" | "loading" | "done" | "error";

export const useSearchUsers = (
  trimmedQuery: string,
  setActiveIndex: Dispatch<SetStateAction<number>>,
) => {
  const [results, setResults] = useState<UserPreview[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (trimmedQuery === "") {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const users = await searchUsers(trimmedQuery, controller.signal);

        setResults(users);
        setActiveIndex(-1);
        setStatus("done");
      } catch (err) {
        if (axios.isCancel(err)) return;

        setResults([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  return { results, status };
};
