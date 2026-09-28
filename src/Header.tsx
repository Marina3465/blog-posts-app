import { useUser } from "./entities/user/useUser";

export const Header = () => {
  const { user, logOut, isLoading } = useUser();

  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center px-5">
      <img src="/icons/logo.svg" alt="Иконка блога" className="w-15 mr-2" />
      <div className="font-sans flex items-end gap-5">
        <h1 className="text-3xl font-extrabold tracking-[-1px] m-0">
          Post
          <span className="bg-linear-to-br from-(--color-orange) to-(--color-rose) bg-clip-text text-transparent">
            &amp;
          </span>
          Pulse
        </h1>

        <span className="text-sm pb-0.5 font-semibold text-[#767676] tracking-[3px] uppercase">
          BLOG &amp; COMMUNITY
        </span>
      </div>

      {user && (
        <div className="ml-auto flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <span className="size-9 rounded-full bg-linear-to-br from-(--color-orange) to-(--color-rose) text-white font-semibold flex items-center justify-center">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}

          <span className="grid leading-tight">
            <span className="font-semibold text-sm">{user.name}</span>
            <span className="text-xs text-[#767676]">@{user.userTag}</span>
          </span>

          <button
            type="button"
            onClick={logOut}
            disabled={isLoading}
            className="rounded-full border border-gray-300 py-1.5 px-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:shadow-md disabled:opacity-50"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};
