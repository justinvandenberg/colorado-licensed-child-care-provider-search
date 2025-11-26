import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ProvidersProvider } from "@/providers/ProvidersProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/providers/UserProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ProvidersProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ProvidersProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
