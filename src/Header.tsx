export const Header = () => {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center px-5">
      <img
        src="/icons/logo-with-text.svg"
        alt="Иконка блога"
        className="w-40"
      />
      <div className="inline-flex flex-col font-sans leading-none">
        <h1 className="text-[46px] font-extrabold text-[#1A1A1A] tracking-[-1px] m-0">
          Post
          <span className="bg-linear-to-br from-(--color-orange) to-(--color-rose) bg-clip-text text-transparent">
            &amp;
          </span>
          Pulse
        </h1>

        <span className="mt-[6px] ml-[2px] text-[14px] font-semibold text-[#767676] tracking-[3px] uppercase">
          BLOG &amp; COMMUNITY
        </span>
      </div>
    </header>
  );
};
