type Props = {
  onClick: () => void;
};

export const CreatePostButton = ({ onClick }: Props) => {
  return (
    <div className="flex justify-end mb-5">
      <button
        className="bg-orange-500 py-2 px-3 rounded-full text-white cursor-pointer font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
        onClick={onClick}
      >
        + New post
      </button>
    </div>
  );
};
