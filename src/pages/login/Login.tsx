import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/entities/user/useUser";
import { LoginForm } from "@/features/auth/LoginForm";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { GoogleButton } from "@/features/auth/GoogleButton";
import { useAuthProviders } from "@/features/auth/useAuthProviders";

export const Login = () => {
  const { user, isAuthChecked, clearError } = useUser();
  const { isGoogleEnabled } = useAuthProviders();
  const [isRegistering, setIsRegistering] = useState(false);

  // Пока не знаем, залогинен ли пользователь, форму не показываем —
  // иначе она мигнет перед редиректом на ленту
  if (!isAuthChecked) return null;

  if (user) return <Navigate to="/" replace />;

  const toggleMode = () => {
    clearError();
    setIsRegistering((prev) => !prev);
  };

  return (
    <div
      className="w-full h-dvh flex justify-center items-center bg-repeat bg-size-[450px_490px] animate-bg-drift"
      style={{ backgroundImage: "url('/icons/background-tile.jpeg')" }}
    >
      <div className="bg-black/20 w-full h-dvh absolute" />
      <div className="bg-white p-10 border border-gray-200 grid gap-6 rounded-2xl shadow-xl shadow-black/5 relative z-10">
        <h2 className="text-2xl font-extrabold tracking-[-0.5px]">
          {isRegistering ? "Create account" : "Welcome back"}
        </h2>

        {isRegistering ? <RegisterForm /> : <LoginForm />}

        {isGoogleEnabled && (
          <>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-[#767676]">
              <span className="h-px flex-1 bg-gray-200" />
              or
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <GoogleButton />
          </>
        )}

        <p className="text-sm text-[#767676]">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-rose-500 cursor-pointer hover:underline"
          >
            {isRegistering ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};
