"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  signupUser,
  SignupRequest,
  SignupResponse,
  loginUser,
  LoginRequest,
  LoginResponse,
} from "@/lib/api/auth";
import useAuthStore from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setAuthData } = useAuthStore();

  return useMutation<
    SignupResponse,
    Error,
    SignupRequest
  >({
    mutationFn: signupUser,

    onMutate: (variables) => {
      console.log("Starting signup mutation:", {
        email: variables.email,
      });
    },

    onSuccess: (data) => {
      console.log("Signup successful:", data);

      if (
        data.success &&
        data.token &&
        data.user
      ) {
        setAuthData(data.token, data.user);

        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        queryClient.setQueryData(["auth"], {
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      }
    },

    onError: (error) => {
      console.error(
        "Signup error:",
        error.message
      );
    },

    onSettled: () => {
      console.log("Signup mutation settled");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthData } = useAuthStore();

  return useMutation<
    LoginResponse,
    Error,
    LoginRequest
  >({
    mutationFn: loginUser,

    onMutate: (variables) => {
      console.log("Starting login mutation:", {
        email: variables.email,
      });
    },

    onSuccess: (data) => {
      console.log("Login successful:", data);

      if (
        data.success &&
        data.token &&
        data.user
      ) {
        // Store auth data
        setAuthData(data.token, data.user);

        // Update React Query cache
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        queryClient.setQueryData(["auth"], {
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });

        // Redirect based on role
        if (
          data.user.role === "superadmin" ||
          data.user.role === "admin"
        ) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    },

    onError: (error) => {
      console.error(
        "Login error:",
        error.message
      );
    },

    onSettled: () => {
      console.log("Login mutation settled");
    },
  });
};
