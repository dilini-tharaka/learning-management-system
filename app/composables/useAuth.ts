import type { SignInSchema } from "~~/shared/schemas/auth";

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
  };
  accessToken?: string;
  message?: string;
  isAccountSetup?: boolean;
}

export const useAuth = () => {
  const user = useState("user", () => null as AuthResponse["user"] | null);
  const accessToken = useState("access_token", () => null as string | null);

  // Add refreshAccessToken function
  const refreshAccessToken = async () => {
    try {
      // Call the refresh token API endpoint
      const response = await $fetch<{ accessToken: string }>('/api/auth/session', {
        method: 'GET',
      });

      // Update the access token in state
      if (response.accessToken) {
        accessToken.value = response.accessToken;
        return response.accessToken;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      user.value = null;
      accessToken.value = null;
      throw error;
    }
  };

  const signIn = async (credentials: SignInSchema) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/sign-in", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;
      accessToken.value = response.accessToken || null;

      // Check if user is student and needs account setup
      if (response.user.role === 'STUDENT' && !response.isAccountSetup) {
        await navigateTo('/console/setup-account');
        return response;
      }

      // Handle normal redirect for other cases
      const redirect = useState("redirect");
      const redirectPath = redirect.value || "/console";
      redirect.value = null; // Clear the redirect
      await navigateTo(redirectPath);

      return response;
    } catch (error: any) {
      // Extract error message from the response
      const message =
        error?.response?._data?.message ||
        error.message ||
        "Something went wrong";
      throw createError({
        statusCode: error.statusCode || 500,
        message,
      });
    }
  };

  const signUp = async (credentials: SignInSchema) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/sign-up", {
        method: "POST",
        body: credentials,
      });

      // Only set auth state if user is ACTIVE and tokens are provided
      if (response.user.status === "ACTIVE" && response.accessToken) {
        user.value = response.user;
        accessToken.value = response.accessToken;
        await navigateTo("/console/setup-account");
      } else {
        // For pending users, show success message and redirect to sign in
        const toast = useToast();
        toast.add({
          title: "Account Created",
          description:
            response.message ||
            "Please wait for administrator approval before signing in.",
          color: "green",
          timeout: 8000,
        });
        await navigateTo("/auth/sign-in");
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?._data?.message ||
        error.message ||
        "Something went wrong";
      throw createError({
        statusCode: error.statusCode || 500,
        message,
      });
    }
  };

  const signOut = async () => {
    try {
      await $fetch("/api/auth/sign-out", { method: "POST" });
      // user.value = null;
      // accessToken.value = null;
      // Force reload to clear any cached state
      window.location.href = "/auth/sign-in";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    user,
    accessToken,
    signIn,
    signUp,
    signOut,
    refreshAccessToken, // Export the new function
  };
};
