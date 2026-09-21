import { useLocalSearchParams } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { BookingDetailScreen } from "@/screens/BookingDetailScreen";

export default function BookingDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!id) {
    return <EmptyState icon="document-text-outline" title="Missing booking" message="No booking id was provided." />;
  }

  return <BookingDetailScreen id={id} />;
}
