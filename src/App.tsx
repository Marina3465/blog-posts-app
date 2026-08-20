import { Header } from "./Header";

interface AppProps {
  title?: string;
}

export default function App({ title = "Привет, TypeScript!" }: AppProps) {
  return (
    <>
      <Header />
      <h1>{title}</h1>
    </>
  );
}
