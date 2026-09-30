import { SubmitEvent, useState } from "react";
import { useUser } from "@/entities/user/useUser";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { IconButton } from "@/shared/ui/IconButton";
import { EyeIcon, EyeSlashIcon } from "@/shared/icons";

export const LoginForm = () => {
  const { logIn, isLoading, error } = useUser();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const isReady = login.trim() !== "" && password !== "";

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!isReady || isLoading) return;

    logIn({ login: login.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        placeholder="Email or tag"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
        autoComplete="username"
        disabled={isLoading}
      />

      <div className="relative flex items-center">
        <Input
          type={isShowPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          disabled={isLoading}
          className="pr-9"
        />
        <IconButton
          className="absolute right-0 left-auto text-gray-600"
          icon={isShowPassword ? <EyeSlashIcon /> : <EyeIcon />}
          onClick={() => setIsShowPassword((prev) => !prev)}
        />
      </div>

      {error && <p className="w-80 text-sm text-rose-600">{error}</p>}

      <Button type="submit" disabled={!isReady || isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
