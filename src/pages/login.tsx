import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/constants/routes";
import { api } from "@/lib/axios";
import Head from "next/head";
import { APP_NAME } from "@/lib/env";
import { AxiosError } from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { reason } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/login", { username, password });
      router.push(routes.index);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          setError(err.response?.data?.detail);
        } else {
          setError("Server error, please try again later");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reason === "unauthorized") {
      setError("Please login to continue.")
    }
  }, [router, reason])

  return (
    <>
      <Head>
        <title>{`${APP_NAME} | Login`}</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-brand-900">
        <Card className="w-full max-w-md shadow-xl p-5 px-0">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex gap-2 items-center justify-center">
                <div className="text-2xl">{APP_NAME}</div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && <p className="mb-4 text-sm text-red-500  text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-2" htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
