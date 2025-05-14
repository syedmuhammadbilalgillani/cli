"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

// Interface for form errors
interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
}
interface LoginFormData {
  username: string;
  password: string;
}
interface ForgetPassowrdFormData {
  email: string;
}

// Validation schema for login using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Validation schema for Forgot Password using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

const AuthForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const { t } = useTranslation();

  // Using react-hook-form for login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Using react-hook-form for forgot password form
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
  } = useForm<ForgetPassowrdFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await login(data.username, data.password, "en");

      if (response) {
        setErrorMessage(response);
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
      setErrorMessage("Invalid Email or Password");
    }

    setLoading(false);
  };

  const handleForgotPassword = async (data: { email: string }) => {
    setForgotPasswordMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/customer/password/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          locale: LOCALE_LANGUAGE,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setForgotPasswordMessage("Password reset email sent successfully.");
      } else {
        setForgotPasswordMessage(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setForgotPasswordMessage("Failed to send reset email.");
    }
  };

  return (
    <Card className="md:p-6 p-3 shadow-lg w-[400px] -mt-10">
      <CardContent>
        <TranslatedText
          ns="common"
          textKey="login.heading"
          className="text-xl font-semibold text-center text-gray-700"
          as="h1"
        />

        <p className="mt-2 text-sm text-gray-500 text-center">
          <TranslatedText ns="common" textKey="login.subheading" />
        </p>

        <form
          className="flex flex-col gap-2 mt-6"
          // onSubmit={handleSubmit(onSubmit)}
        >
          {/* Username Input */}
          <div>
            <Label className="text-sm">
              <TranslatedText ns="common" textKey="login.username_label" />
            </Label>
            <Input
              type="text"
              {...register("username")}
              placeholder={t("login.username_placeholder")}
              className="text-sm text-primary"
            />
            {errors.username && (
              <p className="text-red-500 text-xs">
                {errors.username.message as any}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Label className="text-sm">
              <TranslatedText ns="common" textKey="login.password_label" />
            </Label>
            <Input
              type="password"
              {...register("password")}
              placeholder={t("login.password_placeholder")}
              className="text-sm text-primary"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message as any}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              <TranslatedText ns="common" textKey="login.remember_me" />
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="mt-4 text-white"
          >
            <TranslatedText
              ns="common"
              textKey={loading ? "login.submitting" : "login.submit"}
            />
          </Button>

          {/* Display Error Message Below Form */}
          {errorMessage && (
            <p className="text-red-500 text-xs text-start mt-3">
              <TranslatedText ns="common" textKey="login.error" />
            </p>
          )}
        </form>
      </CardContent>
      {/* not working from server side */}
      {/* <button
              type="button"
              className="hover:text-primary"
              onClick={() => setShowForgotPassword(true)}
            >
              <TranslatedText ns="common" textKey="login.forgot_password" />
            </button> */}
      {/* Forgot Password Dialog */}
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <TranslatedText
                className={"text-primary"}
                ns="common"
                textKey="login.forgot_password_title"
              />
            </DialogTitle>
          </DialogHeader>
          <form>
            {/* Email Input */}
            <div>
              <Label className="text-sm">
                <TranslatedText
                  ns="common"
                  textKey="login.forgot_password_label"
                  className={"text-primary"}
                />
              </Label>
              <Input
                type="email"
                {...registerForgotPassword("email")}
                placeholder={t("login.forgot_password_placeholder")}
                className="text-primary"
              />
              {forgotPasswordErrors.email && (
                <p className="text-red-500 text-xs">
                  {forgotPasswordErrors.email.message as any}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={() => handleForgotPasswordSubmit(handleForgotPassword)}
              className="mt-4 text-white w-full"
            >
              <TranslatedText
                ns="common"
                textKey="login.forgot_password_submit"
              />
            </Button>

            {/* Display Success/Error Message */}
            {forgotPasswordMessage && (
              <p className="text-center mt-2 text-sm text-primary">
                <TranslatedText
                  ns="common"
                  textKey="login.forgot_password_message"
                />
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AuthForm;
