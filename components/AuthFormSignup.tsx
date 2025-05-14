"use client";
import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

// 🎯 Validation Schema with Zod
const schema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .nonempty("Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .nonempty("Username is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
  password_confirmation: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters"),
  // .refine((val, ctx) => val === ctx.parent.password, "Passwords must match")
  // .nonempty("Password confirmation is required"),
});

const AuthFormSignup = () => {
  const navigate = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [apiError, setApiError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const { t } = useTranslation();

  // 🚀 Form Submission
  const onSubmit = async (formData: any) => {
    setApiError(null);
    setServerErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        ...formData,
        locale: LOCALE_LANGUAGE,
      });
      console.log(response, "res");
      navigate.push("/sign-in"); // ✅ Redirect to the login page after successful signup
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errors: validationErrors } = error.response.data;

        setApiError(message || "An error occurred during registration.");

        // Handle validation errors from the server
        if (validationErrors) {
          setServerErrors(validationErrors);

          // Set form errors for each field with validation error
          Object.keys(validationErrors).forEach((field) => {
            if (field in formData) {
              setError(field, {
                type: "server",
                message: validationErrors[field][0],
              });
            }
          });
        }
      } else if (error.request) {
        setApiError("Network error. Please check your internet connection.");
      } else {
        setApiError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 text-sm md:w-[500px] min-w-[350px] -mt-10">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <TranslatedText
          textKey={"register.heading"}
          as="h1"
          className="text-2xl font-bold text-center text-primary"
        />

        {apiError && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <TranslatedText
              textKey={"register.error_heading"}
              as="p"
              className="font-medium"
            />
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <TranslatedText
              as="label"
              textKey={"register.full_name_label"}
              className="block text-sm font-medium text-gray-700"
            />

            <input
              type="text"
              {...register("name")}
              className="w-full text-primary p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder={t("register.full_name_placeholder")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message as any}</p>
            )}
          </div>

          {/* Username Field */}
          <div>
            <TranslatedText
              as="label"
              textKey={"register.username_label"}
              className="block text-sm font-medium text-gray-700"
            />
            <input
              type="text"
              {...register("username")}
              className={`w-full text-primary p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${
                errors.username || serverErrors.username
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("register.username_placeholder")}
            />
            {(errors.username || serverErrors.username) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username?.message ||
                  (serverErrors.username && serverErrors.username[0])}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <TranslatedText
              as="label"
              textKey={"register.email_label"}
              className="block text-sm font-medium text-gray-700"
            />
            <input
              type="email"
              {...register("email")}
              className={`w-full text-primary p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${
                errors.email || serverErrors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("register.email_placeholder")}
            />
            {(errors.email || serverErrors.email) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message ||
                  (serverErrors.email && serverErrors.email[0])}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <TranslatedText
              as="label"
              textKey={"register.password_label"}
              className="block text-sm font-medium text-gray-700"
            />
            <input
              type="password"
              {...register("password")}
              className={`w-full text-primary p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${
                errors.password || serverErrors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("register.password_placeholder")}
            />
            {(errors.password || serverErrors.password) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message ||
                  (serverErrors.password && serverErrors.password[0])}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <TranslatedText
              as="label"
              textKey={"register.confirm_password_label"}
              className="block text-sm font-medium text-gray-700"
            />
            <input
              type="password"
              {...register("password_confirmation")}
              className={`w-full text-primary p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${
                errors.password_confirmation
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("register.confirm_password_placeholder")}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message as any}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 text-white font-bold rounded-md transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80"
            }`}
            disabled={isLoading}
          >
            <TranslatedText
              textKey={isLoading ? "register.submitting" : "register.submit"}
            />
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-gray-600">
          <TranslatedText textKey={"register.login_redirect"} />{" "}
          <Link
            href={"/sign-in"}
            className="text-secondary cursor-pointer hover:underline"
          >
            <TranslatedText textKey={"register.login_link"} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthFormSignup;
