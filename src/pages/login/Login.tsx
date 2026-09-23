import { Input } from "@/shared/ui/Input";

export const Login = () => {
  return (
    <div
      className="w-full h-dvh flex justify-center items-center bg-repeat bg-size-[450px_490px] animate-bg-drift"
      style={{ backgroundImage: "url('/icons/background-tile.jpeg')" }}
    >
      <div className="bg-white p-10 border border-gray-200 grid gap-6 rounded-2xl">
        <Input type="email" />
        <Input type="password" />
      </div>
    </div>
  );
};
