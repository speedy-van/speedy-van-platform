import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { usePendingBookings } from "@/hooks/usePendingBookings";
import { colors } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  return function Icon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };
}

export default function TabLayout() {
  const pending = usePendingBookings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.svBrand,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.svLine,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 10,
          paddingTop: 2,
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: tabIcon("home") }} />
      <Tabs.Screen
        name="bookings/index"
        options={{
          title: "Bookings",
          tabBarIcon: tabIcon("calendar"),
          tabBarBadge: pending.data > 0 ? pending.data : undefined
        }}
      />
      <Tabs.Screen name="jobs" options={{ title: "Dispatch", tabBarIcon: tabIcon("briefcase") }} />
      <Tabs.Screen name="notifications" options={{ title: "Alerts", tabBarIcon: tabIcon("notifications") }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: tabIcon("ellipsis-horizontal-circle") }} />
      <Tabs.Screen name="bookings/[id]" options={{ href: null, title: "Booking" }} />
      <Tabs.Screen name="drivers/index" options={{ href: null, title: "Drivers" }} />
      <Tabs.Screen name="drivers/[id]" options={{ href: null, title: "Driver" }} />
      <Tabs.Screen name="analytics" options={{ href: null, title: "Analytics" }} />
      <Tabs.Screen name="enquiries" options={{ href: null, title: "Enquiries" }} />
      <Tabs.Screen name="images" options={{ href: null, title: "Images" }} />
      <Tabs.Screen name="visitors" options={{ href: null, title: "Visitors" }} />
    </Tabs>
  );
}
