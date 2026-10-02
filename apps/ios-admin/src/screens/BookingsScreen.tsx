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

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 overflow-hidden rounded-2xl bg-white"
      style={{ borderWidth: 1, borderColor: colors.svLine }}
    >
      <View className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl" style={{ backgroundColor: meta.color }} />
      <View className="px-4 py-3.5 pl-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-mono text-[11px] font-extrabold uppercase" style={{ color: colors.muted }}>
                {booking.reference}
              </Text>
              {booking.isDraft ? (
                <View
                  className="rounded px-1.5 py-0.5"
                  style={{ backgroundColor: `${colors.svWarning}20` }}
                >
                  <Text className="text-[10px] font-extrabold uppercase" style={{ color: colors.svWarning }}>
                    Draft
                  </Text>
                </View>
              ) : null}
            </View>
            <Text className="mt-1 text-[17px] font-extrabold text-svDark" numberOfLines={1} style={{ letterSpacing: -0.3 }}>
              {booking.customerName}
            </Text>
            <Text className="mt-0.5 text-sm font-bold text-slate-500" numberOfLines={1}>
              {booking.serviceName ?? booking.serviceSlug}
            </Text>
          </View>
          <View className="items-end gap-1.5">
            <StatusBadge label={meta.label} color={meta.color} />
            <Text className="text-base font-extrabold" style={{ color: colors.svGreen }}>
              {formatMoney(booking.totalPrice ?? booking.price)}
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row items-center justify-between border-t pt-2.5" style={{ borderColor: "#F1F5F9" }}>
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="location-outline" size={13} color={colors.muted} />
            <Text className="text-xs text-slate-400" numberOfLines={1} style={{ maxWidth: 180 }}>
              {booking.pickupAddress}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={13} color={colors.muted} />
            <Text className="text-xs font-bold text-slate-500">
              {formatDate(date)}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.muted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
