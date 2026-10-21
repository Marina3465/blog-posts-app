import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPreview } from "@/shared/types";
import { Avatar } from "@/shared/ui/Avatar";
import { Input } from "@/shared/ui/Input";
import { cn } from "@/utils/cn";
import { useSearchUsers } from "./api/useSearchUsers";

export const SearchUsers = () => {
  const navigate = useNavigate();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const showDropdown = isOpen && trimmedQuery !== "";

  const { results, status } = useSearchUsers(trimmedQuery, setActiveIndex);

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

  const handleSelectUser = (user: UserPreview) => {
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
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelectUser(results[activeIndex]);
    }
  };

  const emptyMessage = () => {
    if (status === "error") {
      return "Search failed, try again";
    }

    if (status === "done") {
      return "Nobody found";
    }

    return "Searching...";
  };

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
            <li className="px-4 py-3 text-sm text-[#767676]">
              {emptyMessage()}
            </li>
          ) : (
            results.map((user, index) => (
              <li
                key={user.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelectUser(user)}
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
