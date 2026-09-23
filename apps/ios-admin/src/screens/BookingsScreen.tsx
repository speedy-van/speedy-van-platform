import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { HeaderMetric, ScreenHeader, ScreenShell, SearchField } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FilterChips, type FilterChipOption } from "@/components/FilterChips";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useBookings } from "@/hooks/useBookings";
import type { BookingListItem, BookingStatus } from "@/models";
import { colors } from "@/theme/colors";
import { formatDate, formatMoney } from "@/utils/format";
import { bookingStatusMeta } from "@/utils/status";

const bookingFilters: FilterChipOption<BookingStatus>[] = [
  { label: "All", value: null },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Active", value: "IN_PROGRESS" },
  { label: "Done", value: "COMPLETED" }
];

export function BookingsScreen() {
  const router = useRouter();
  const state = useBookings();

  if (state.isLoading && state.bookings.length === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Bookings"
        subtitle="Search, filter, assign, and keep each move moving."
        eyebrow="Operations"
        icon="calendar"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Loaded" value={String(state.bookings.length)} icon="albums" />
          <HeaderMetric label="Filter" value={state.status ? bookingStatusMeta(state.status).label : "All bookings"} icon="funnel" />
        </View>
      </ScreenHeader>
      {state.error ? <ErrorBanner message={state.error} /> : null}
      <View className="px-4 pt-4">
        <SearchField
          value={state.search}
          onChangeText={state.setSearch}
          placeholder="Search bookings"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FilterChips options={bookingFilters} value={state.status} onChange={state.setStatus} />
      <FlatList
        data={state.bookings}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={state.isLoading} onRefresh={() => void state.load(true)} />}
        onEndReached={() => void state.loadMore()}
        onEndReachedThreshold={0.4}
        contentContainerClassName={state.bookings.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="calendar-outline" title="No bookings" message="Bookings matching your filters will appear here." />}
        renderItem={({ item }) => (
          <BookingRow booking={item} onPress={() => router.push(`/bookings/${item.id}`)} />
        )}
      />
    </ScreenShell>
  );
}

function BookingRow({ booking, onPress }: { booking: BookingListItem; onPress: () => void }) {
  const meta = bookingStatusMeta(booking.status);
  const date = booking.scheduledDate ?? booking.scheduledAt;
  const timeSlot = booking.timeSlot ?? booking.selectedTimeSlot ?? "Time TBC";

  return (
    <Pressable onPress={onPress} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
            <Ionicons name="receipt-outline" size={21} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            <Text className="font-mono text-xs font-extrabold uppercase text-slate-500">{booking.reference}</Text>
            <Text className="mt-1 text-lg font-extrabold text-svDark" numberOfLines={1}>
              {booking.customerName}
            </Text>
          </View>
        </View>
        <StatusBadge label={meta.label} color={meta.color} />
      </View>
      <View className="mt-4 gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm font-bold text-slate-600" numberOfLines={1}>
            {booking.serviceName ?? booking.serviceSlug}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm text-slate-500" numberOfLines={1}>
            {booking.pickupAddress}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View>
          <Text className="text-xs font-bold uppercase text-slate-400">Scheduled</Text>
          <Text className="mt-0.5 text-sm font-extrabold text-svDark">{formatDate(date)} - {timeSlot}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-extrabold text-svGreen">{formatMoney(booking.totalPrice ?? booking.price)}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </View>
    </Pressable>
  );
}
