import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="patients"
        options={{ title: 'Patients' }}
      />
      <Tabs.Screen
        name="diseases"
        options={{ title: 'Diseases' }}
      />
      <Tabs.Screen
        name="companies"
        options={{ title: 'Companies' }}
      />
    </Tabs>
  );
}
