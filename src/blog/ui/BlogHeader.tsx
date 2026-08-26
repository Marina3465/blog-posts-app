export const BlogHeader = () => {
  return (
    <div className="flex">
      <div className="w-fit rounded-full p-3 bg-rose-200 text-rose-500 font-bold">
        MK
      </div>
      <div className="grid ml-3">
        <div className="flex gap-2 items-center">
          <span className="font-semibold font-base">Marina Kovaleva</span>
          <img
            src="/icons/verification.svg"
            alt="значек верификации"
            className="w-4"
          />
        </div>
        <span className="text-xs text-gray-500">
          @marinakv · Delivery lead · 2h ago
        </span>
      </div>
    </div>
  );
};
