import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export function useApiFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { accessToken, refreshAccessToken } = useAuth();

  const defaults: UseFetchOptions<T> = {
    key: url,
    headers: accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {},
    watch: false,
    ...options,
  };

  // Add onResponseError interceptor to handle 401 errors
  defaults.onResponseError = async (error) => {
    const status = error?.response?.status;

    // If received 401 unauthorized error and we have an onResponseError handler
    if (status === 401) {
      try {
        // Try to refresh the token
        await refreshAccessToken();

        // Retry the original request with new token
        const { watch, key, ...fetchOptions } = options;
        const { method, body, params } = fetchOptions;
        return await $apiFetch<T>(url, {
          method: unref(method),
          body,
          params,
          headers: { Authorization: `Bearer ${accessToken.value}` },
        });
      } catch (tokenError) {
        // If refresh fails, redirect to login
        await navigateTo("/auth/sign-in");
      }
    }

    // Call original onResponseError handler if exists and is a function
    if (
      options.onResponseError &&
      typeof options.onResponseError === "function"
    ) {
      return options.onResponseError(error);
    }
  };

  if (import.meta.client) {
    defaults.headers = {
      ...defaults.headers,
      "client-platform": "browser",
    };
  }

  return useFetch(url, defaults);
}

export async function $apiFetch<T>(
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
) {
  const { accessToken, refreshAccessToken } = useAuth();

  const headers = {
    ...(accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}),
    ...(import.meta.client ? { "client-platform": "browser" } : {}),
    ...options.headers,
  };

  try {
    return await $fetch<T>(url, {
      ...options,
      headers,
    });
  } catch (error: any) {
    // Handle 401 errors by refreshing token
    if (error?.response?.status === 401) {
      try {
        // Try to refresh the token
        await refreshAccessToken();

        // Retry the original request with new token
        return await $fetch<T>(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken.value}`,
          },
        });
      } catch (tokenError) {
        // If refresh fails, redirect to login
        await navigateTo("/auth/sign-in");
      }
    }

    // If not a 401 error or token refresh failed, throw the original error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error?.response?._data?.message || error.message,
    });
  }
}
