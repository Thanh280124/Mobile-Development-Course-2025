import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="addItem" />
        <Stack.Screen name="listItem" />
        <Stack.Screen name="items/[id]" />
      </Stack>
    </SafeAreaProvider>
  )
 
}
