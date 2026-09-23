type Props = {
  type?: string;
};

export const Input = ({ type = "text" }: Props) => {
  return (
    <input
      type={type}
      className="bg-white py-3 px-4 border border-gray-200 rounded-xl text-sm w-80"
    />
  );
};
