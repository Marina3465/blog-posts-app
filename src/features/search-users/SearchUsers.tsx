import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "@/entities/user/searchUsers";
import { UserPreview } from "@/shared/types";
import { Avatar } from "@/shared/ui/Avatar";
import { Input } from "@/shared/ui/Input";
import { cn } from "@/utils/cn";

const DEBOUNCE_MS = 300;

type Status = "idle" | "loading" | "done" | "error";

export const SearchUsers = () => {
  const navigate = useNavigate();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserPreview[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const showDropdown = isOpen && trimmedQuery !== "";

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
        // Отмененный запрос — не ошибка: на его место уже идет новый
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

  // Клик мимо поля и списка закрывает подсказки
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const selectUser = (user: UserPreview) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/posts/${encodeURIComponent(user.userTag)}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!showDropdown || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectUser(results[activeIndex]);
    }
  };

  const emptyMessage =
    status === "error"
      ? "Search failed, try again"
      : status === "done"
        ? "Nobody found"
        : "Searching...";

  return (
    <div ref={rootRef} className="relative mb-3">
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Find other users"
        className="w-full"
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
      />

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#767676]">{emptyMessage}</li>
          ) : (
            results.map((user, index) => (
              <li
                key={user.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectUser(user)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-2",
                  index === activeIndex && "bg-gray-50",
                )}
              >
                <Avatar user={user} />
                <span className="grid leading-tight">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-[#767676]">
                    @{user.userTag}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
