import "@/styles/globals.css";

import { routes } from "@/constants/routes";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { AppProps } from "next/app";

const publicPaths = [routes.login];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem("user");
      router.push(`${routes.login}?reason=unauthorized`);
    };

    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [router]);

  const isPublic = publicPaths.includes(router.pathname);

  if (isPublic) {
    return <Component {...pageProps} />;
  }
  
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}