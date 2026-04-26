import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Tabs (main app) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Other screens (NOT tabs) */}
      <Stack.Screen name="login" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}