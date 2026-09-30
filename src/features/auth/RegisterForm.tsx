import { FormEvent, useState } from "react";
import { useUser } from "@/entities/user/useUser";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { IconButton } from "@/shared/ui/IconButton";
import { EyeIcon, EyeSlashIcon } from "@/shared/icons";

export const RegisterForm = () => {
  const { register, isLoading, error } = useUser();

  const [name, setName] = useState("");
  const [userTag, setUserTag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const isReady =
    name.trim() !== "" &&
    userTag.trim() !== "" &&
    email.trim() !== "" &&
    password !== "";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isReady || isLoading) return;

    register({
      name: name.trim(),
      userTag: userTag.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        disabled={isLoading}
      />
      <Input
        placeholder="Tag"
        value={userTag}
        onChange={(event) => setUserTag(event.target.value)}
        autoComplete="username"
        disabled={isLoading}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        disabled={isLoading}
      />
      <div className="relative flex items-center">
        <Input
          type={isShowPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
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
        {isLoading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
};
