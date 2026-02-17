import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? -2 : 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';

          if (route.name === 'patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'narcotics') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'diseases') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'companies') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 84 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          elevation: 18,
          shadowColor: '#0F172A',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
      })}
    >
      <Tabs.Screen
        name="patients"
        options={{ title: 'Patients' }}
      />
      <Tabs.Screen
        name="narcotics"
        options={{ title: 'Narcotics' }}
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
