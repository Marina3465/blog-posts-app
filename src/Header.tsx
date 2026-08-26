export const Header = () => {
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
    </header>
  );
};
