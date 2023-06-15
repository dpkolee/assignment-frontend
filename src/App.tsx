import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes";
import { MantineProvider } from "@mantine/core";
import { Theme } from "./theme/Theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "./utils/api-interceptor";
import { helperUtils } from "./utils/helpers";
import { Notifications } from "@mantine/notifications";

function App() {
  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: async (err: any) => {
          const originalConfig = err.config;
          if (err?.response?.status === 401) {
            try {
              const response = await api.post("/auth/refresh/", {
                refresh: helperUtils.getRefreshToken(),
              });
              const { access, refresh } = response.data;
              helperUtils.setAuthorizationToken(access);
              helperUtils.setRefreshToken(refresh);
              api.defaults.headers.common["Authorization"] = "Bearer " + access;
              return api(originalConfig);
            } catch (error: any) {
              helperUtils.removeAuthToken();
              window.location.pathname = "/login";
              if (error.response && error.response.data) {
                return Promise.reject(error.response.data);
              }
              return Promise.reject(error);
            }
          }
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={Theme}>
        <BrowserRouter>
          <Notifications position="top-right" />
          <AllRoutes />
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
