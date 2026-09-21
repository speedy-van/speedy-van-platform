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
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.surface
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800"
        },
        tabBarItemStyle: {
          borderRadius: 8
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
      <Tabs.Screen name="drivers/index" options={{ title: "Drivers", tabBarIcon: tabIcon("people") }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: tabIcon("briefcase") }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: tabIcon("ellipsis-horizontal-circle") }} />
      <Tabs.Screen name="bookings/[id]" options={{ href: null, title: "Booking" }} />
      <Tabs.Screen name="drivers/[id]" options={{ href: null, title: "Driver" }} />
      <Tabs.Screen name="analytics" options={{ href: null, title: "Analytics" }} />
      <Tabs.Screen name="enquiries" options={{ href: null, title: "Enquiries" }} />
      <Tabs.Screen name="images" options={{ href: null, title: "Images" }} />
      <Tabs.Screen name="notifications" options={{ href: null, title: "Notifications" }} />
      <Tabs.Screen name="visitors" options={{ href: null, title: "Visitors" }} />
    </Tabs>
  );
}
