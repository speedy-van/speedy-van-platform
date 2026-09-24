import { useLocalSearchParams } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { useDrivers } from "@/hooks/useDrivers";
import { DriverDetailScreen } from "@/screens/DriverDetailScreen";

export default function DriverDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { drivers, isLoading } = useDrivers();
  const driver = drivers.find((item) => item.id === id);

  if (!id) {
    return <EmptyState icon="person-outline" title="Missing driver" message="No driver id was provided." />;
  }

  if (!driver && isLoading) {
    return <EmptyState icon="person-outline" title="Loading driver" message="Driver details are loading." />;
  }

  if (!driver) {
    return <EmptyState icon="person-outline" title="Driver not found" message="Return to the driver list and try again." />;
  }

  return <DriverDetailScreen driver={driver} />;
}
