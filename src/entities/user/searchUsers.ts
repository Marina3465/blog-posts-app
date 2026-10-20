import { coreInstance } from "@/shared/api";
import { UserPreview } from "@/shared/types";

// signal позволяет отменить запрос, если пользователь уже ввел следующую букву
export const searchUsers = async (query: string, signal?: AbortSignal) => {
  const response = await coreInstance.get<UserPreview[]>("/users/search", {
    params: { q: query },
    signal,
  });

  return response.data;
};
