import { Input } from "@/shared/ui/Input";

export const Login = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="bg-white p-10 border border-gray-200 grid gap-6 rounded-2xl">
        <Input type="email" />
        <Input type="password" />
      </div>
    </div>
  );
};
