import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
