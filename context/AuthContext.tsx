"use client"; // ✅ Important for Next.js App Router

import { BACKEND_URL } from "@/constant/apiUrl";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  // Add more fields according to your backend response
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, language: string) => Promise<string | undefined>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: User) => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string, language: string): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("locale", language);

    try {
      const res = await axiosInstance.post(`/login`, formData);

      console.log(res, "res for login");

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      setUser(res.data.customer);
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error.message);
      return error.message; // Return the error message so it can be displayed
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
