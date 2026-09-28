import { GoogleIcon } from "@/shared/icons";

export const GoogleButton = () => {
  return (
    <a
      // Обычная ссылка, а не axios: OAuth — это цепочка редиректов,
      // XHR не может увести пользователя на домен Google
      href="/api/auth/google"
      className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 px-4 text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
    >
      <GoogleIcon />
      Continue with Google
    </a>
  );
};
