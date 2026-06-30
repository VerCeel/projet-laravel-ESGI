import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

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
import { parseValidationErrors, register } from "@/services/auth";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!name.trim() || !email.trim() || !password) {
      setErrors({ form: "All fields are required." });
      return;
    }

    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters." });
      return;
    }

    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      toast.success("Account created", {
        description: "You can now sign in with your credentials.",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      const validationErrors = parseValidationErrors(error);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UserPlus className="size-5 text-primary" />
          Create an account
        </CardTitle>
        <CardDescription>
          Register to manage categories, products, and clients.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Name</Label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

          <div className="space-y-2">
            <Label htmlFor="register-password-confirmation">Confirm password</Label>
            <Input
              id="register-password-confirmation"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              aria-invalid={Boolean(errors.password_confirmation)}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password_confirmation}
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
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
