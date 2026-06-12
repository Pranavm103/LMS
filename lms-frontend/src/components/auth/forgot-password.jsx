import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { useForgotPasswordMutation } from "@/store/services/auth-service";

export function ForgotPasswordForm({ className, ...props }) {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.trim().toLowerCase();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "bottom-center" });
      return;
    }

    try {
      await forgotPassword({ email, password }).unwrap();
      toast.success("Password reset. Please log in.", { position: "bottom-center" });
      navigate("/auth");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reset password."), { position: "bottom-center" });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your email and choose a new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <Input id="password" name="password" type="password" minLength={8} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                <Input id="confirm-password" name="confirm-password" type="password" minLength={8} required />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>
                <FieldDescription className="text-center">
                  Remembered it? <Link to="/auth">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
