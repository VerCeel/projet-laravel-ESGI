import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseValidationErrors } from "@/services/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from ?? "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!email.trim() || !password) {
      setErrors({ form: "Email and password are required." });
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Welcome back!", {
        description: "You are now signed in.",
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const validationErrors = parseValidationErrors(error);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      } else {
        setErrors({
          form: error.response?.data?.message ?? "Invalid credentials. Please try again.",
        });
      }
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <LogIn className="size-5 text-primary" />
          Sign in
        </CardTitle>
        <CardDescription>
          Enter your credentials to access categories and products.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              autoFocus
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {errors.form && (
            <p className="text-sm text-destructive" role="alert">
              {errors.form}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
