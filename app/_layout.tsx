import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { ProvidersProvider } from "@/providers/ProvidersProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/providers/UserProvider";
import { VisitsProvider } from "@/providers/VisitsProvider";

const LIGHT_STATUS_BAR_PATHNAMES = ["/", "/dev"];

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

const RootLayout = () => {
  const currentPathname = usePathname();

  useEffect(() => {
    console.log(currentPathname);
  }, [currentPathname]);
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ProvidersProvider>
            <VisitsProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                  <StatusBar
                    style={
                      LIGHT_STATUS_BAR_PATHNAMES.includes(currentPathname)
                        ? "light"
                        : "dark"
                    }
                  />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </VisitsProvider>
          </ProvidersProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
