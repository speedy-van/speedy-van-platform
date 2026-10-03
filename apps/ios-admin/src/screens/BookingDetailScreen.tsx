import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { ActionButton, HeaderMetric, InfoRow, ModalHeader, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useBookingDetail } from "@/hooks/useBookings";
import type { BookingDetail, BookingStatus, DriverListItem } from "@/models";
import { colors } from "@/theme/colors";
import { formatDateTime, formatLondonDateTime, formatMoney, formatScheduleDate } from "@/utils/format";
import { bookingStatusMeta } from "@/utils/status";

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const slotLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function BookingDetailScreen({ id }: { id: string }) {
  const detail = useBookingDetail(id);
  const [statusNote, setStatusNote] = useState("");
  const [trackingNote, setTrackingNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);

  if (detail.isLoading && !detail.booking) return <LoadingView />;
  if (!detail.booking) {
    return (
      <ScreenShell>
        {detail.error && !detail.notFound ? <ErrorBanner message={detail.error} /> : null}
        <EmptyState
          icon="document-text-outline"
          title={detail.notFound ? "Booking not found" : "Booking unavailable"}
          message={detail.notFound ? "This booking could not be found." : "This booking could not be loaded."}
        />
      </ScreenShell>
    );
  }

  const booking = detail.booking;
  const meta = bookingStatusMeta(booking.status);
  const total = formatBookingMoney(booking);

  return (
    <ScreenShell>
      <ScrollView
        refreshControl={<RefreshControl refreshing={detail.isRefreshing} onRefresh={() => void detail.load()} />}
        contentContainerClassName="pb-10"
      >
        <ScreenHeader
          title={booking.reference}
          subtitle={valueOrFallback(booking.customerName, booking, "customerName")}
          eyebrow={booking.isDraft ? "Pending checkout" : "Booking Detail"}
          icon="receipt"
          right={<StatusBadge label={meta.label} color={meta.color} />}
        >
          <View className="flex-row flex-wrap gap-2">
            <HeaderMetric label={booking.isDraft ? "Estimate" : "Total"} value={total} icon="cash" />
            <HeaderMetric label="Driver" value={booking.driver?.user.name ?? "Unassigned"} icon="person" />
          </View>
        </ScreenHeader>
        {detail.error ? <ErrorBanner message={detail.error} /> : null}
        {detail.isStale ? <ErrorBanner message="Showing the last saved details. Refresh failed." /> : null}
        <View className="gap-4 p-4">
          {booking.isDraft ? (
            <View className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <Text className="text-sm font-extrabold uppercase text-amber-700">Pending checkout</Text>
              <Text className="mt-1 text-sm font-bold leading-5 text-slate-600">
                This is a saved estimate. Protected actions unlock after checkout is completed.
              </Text>
            </View>
          ) : null}

          <SectionCard title="Summary" subtitle="Current booking state." icon="receipt-outline">
            <InfoRow label="Reference" value={booking.reference} mono />
            <InfoRow label="Service" value={serviceLabel(booking)} />
            <InfoRow label="Status" value={meta.label} />
            <InfoRow label="Move scheduled for" value={formatMoveSchedule(booking)} />
          </SectionCard>

          <SectionCard title="Booking activity" subtitle="Recorded server events, not inferred website activity." icon="time-outline">
            {booking.isDraft ? (
              <InfoRow label="First saved" value={formatLondonDateTime(booking.createdAt)} />
            ) : (
              <InfoRow label="Booking created" value={formatLondonDateTime(booking.createdAt)} />
            )}
            <InfoRow
              label={booking.isDraft ? "Last saved" : "Last updated"}
              value={formatLondonDateTime(booking.updatedAt ?? null)}
            />
            {booking.isDraft ? (
              <InfoRow label="Checkout stage" value={booking.checkoutStage ?? "Not recorded"} />
            ) : (
              <InfoRow label="Payment received" value={booking.isPaid ? formatLondonDateTime(booking.paidAt ?? null) : "Not recorded"} />
            )}
          </SectionCard>

          <SectionCard title="Journey & access" subtitle="Pickup, drop-off, and access details." icon="navigate-outline">
            <View className="gap-3">
              <AddressCard title="Pickup" booking={booking} side="pickup" />
              <AddressCard title="Drop-off" booking={booking} side="dropoff" />
              <InfoRow label="Distance" value={formatDistance(booking)} />
              {shouldShowDraftAccess(booking) ? (
                <>
                  <InfoRow label="Narrow access" value={formatBooleanSelection(booking.hasNarrowAccess, booking, "hasNarrowAccess")} />
                  <InfoRow label="Permit zone" value={formatBooleanSelection(booking.hasPermitZone, booking, "hasPermitZone")} />
                </>
              ) : null}
            </View>
          </SectionCard>

          <SectionCard title="Customer" subtitle="Primary contact for this move." icon="person-outline">
            <InfoRow label="Name" value={valueOrFallback(booking.customerName, booking, "customerName")} selectable />
            <InfoRow label="Email" value={valueOrFallback(booking.customerEmail, booking, "customerEmail")} selectable />
            <InfoRow label="Phone" value={valueOrFallback(booking.customerPhone, booking, "customerPhone")} selectable />
            <InfoRow label="Customer notes" value={booking.notes?.trim() || missingLabel(booking)} numberOfLines={8} selectable />
          </SectionCard>

          <SectionCard title="Inventory" subtitle="Customer inventory for the move." icon="cube-outline">
            {inventoryUnavailable(booking) ? (
              <Text className="text-sm font-bold text-slate-500">{missingLabel(booking)}</Text>
            ) : booking.items.length === 0 ? (
              <Text className="text-sm font-bold text-slate-500">No items listed</Text>
            ) : (
              <View className="gap-2">
                {booking.items.map((item) => (
                  <View key={item.id} className="flex-row items-start justify-between gap-3 rounded-lg bg-svSoft px-3 py-3">
                    <Text className="flex-1 text-sm font-extrabold leading-5 text-svDark" selectable>{item.name}</Text>
                    <Text className="rounded-lg bg-white px-2 py-1 text-xs font-extrabold text-slate-600">Qty {item.quantity}</Text>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          <SectionCard title="Extras" subtitle="Optional add-ons selected by the customer." icon="add-circle-outline">
            <InfoRow label="Additional helpers" value={formatHelpers(booking)} />
            <InfoRow label="Packing service" value={formatBooleanSelection(booking.needsPacking, booking, "needsPacking")} />
            <InfoRow label="Assembly" value={formatAssembly(booking)} />
            {booking.needsAssembly ? <InfoRow label="Assembly quantity" value={formatAssemblyQuantity(booking)} /> : null}
          </SectionCard>

          <SectionCard title="Payment summary" subtitle="Read-only price and payment state." icon="card-outline">
            <InfoRow label={booking.isDraft ? "Current estimate" : "Total"} value={total} accent={hasKnownPrice(booking)} />
            <InfoRow label="Payment status" value={formatPaymentStatus(booking)} />
            {!booking.isDraft ? (
              <InfoRow label="Payment received" value={booking.isPaid ? formatLondonDateTime(booking.paidAt ?? null) : "Not recorded"} />
            ) : null}
          </SectionCard>

          <SectionCard title="Driver" subtitle="Assign or reassign this move." icon="car-outline">
            <InfoRow label="Assigned" value={booking.driver?.user.name ?? "Unassigned"} />
            {detail.driverError ? <Text className="mt-2 text-sm font-bold text-amber-700">{detail.driverError}</Text> : null}
            {booking.isDraft ? (
              <Text className="mt-3 text-sm font-bold text-slate-500">Assign a driver after checkout is completed.</Text>
            ) : (
              <ActionButton label="Assign Driver" icon="person-add" onPress={() => setShowDrivers(true)} />
            )}
          </SectionCard>

          <SectionCard title="Status control" subtitle="Operational status updates." icon="options-outline">
            <StatusBadge label={meta.label} color={meta.color} />
            {booking.isDraft ? (
              <Text className="mt-4 text-sm font-bold text-slate-500">
                Status controls unlock after the customer completes checkout.
              </Text>
            ) : (
              <>
                <TextInput
                  value={statusNote}
                  onChangeText={setStatusNote}
                  placeholder="Optional status note"
                  placeholderTextColor="#94A3B8"
                  className="mt-4 rounded-lg border border-svLine bg-svSoft px-3 py-3 text-svDark"
                />
                <View className="mt-3 flex-row flex-wrap gap-2">
                  {statuses.map((status) => {
                    const statusMeta = bookingStatusMeta(status);
                    const selected = booking.status === status;
                    return (
                      <Pressable
                        key={status}
                        onPress={() => void detail.updateStatus(status, statusNote)}
                        className="rounded-lg border px-3 py-2"
                        style={{
                          backgroundColor: selected ? `${statusMeta.color}18` : "#FFFFFF",
                          borderColor: selected ? `${statusMeta.color}66` : colors.border,
                        }}
                      >
                        <Text className="text-xs font-extrabold uppercase" style={{ color: statusMeta.color }}>
                          {statusMeta.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </SectionCard>

          <SectionCard title="History" subtitle="Internal notes and customer movement history." icon="trail-sign-outline">
            {booking.trackingEvents.length === 0 ? (
              <Text className="text-sm font-bold text-slate-500">No tracking events</Text>
            ) : (
              <View className="gap-3">
                {booking.trackingEvents.map((event) => (
                  <View key={event.id} className="flex-row gap-3">
                    <View className="mt-1 h-8 w-8 items-center justify-center rounded-lg bg-svBrandSubtle">
                      <Ionicons name={event.isInternal ? "lock-closed-outline" : "navigate-outline"} size={15} color={colors.svBrand} />
                    </View>
                    <View className="flex-1 border-b border-slate-100 pb-3">
                      <Text className="font-extrabold text-svDark">{event.note ?? event.message ?? event.type}</Text>
                      <Text className="mt-1 text-xs font-bold text-slate-500">{formatDateTime(event.createdAt, "Not recorded")}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {booking.isDraft ? (
              <Text className="mt-4 text-sm font-bold text-slate-500">Internal notes unlock after checkout is completed.</Text>
            ) : (
              <>
                <TextInput
                  value={trackingNote}
                  onChangeText={setTrackingNote}
                  placeholder="Add internal note"
                  placeholderTextColor="#94A3B8"
                  multiline
                  className="mt-4 min-h-24 rounded-lg border border-svLine bg-svSoft px-3 py-3 text-svDark"
                />
                <View className="mt-3">
                  <ActionButton
                    label="Add Note"
                    icon="add-circle"
                    disabled={trackingNote.trim().length === 0}
                    onPress={() => {
                      const note = trackingNote.trim();
                      void detail.addTrackingNote(note).then((saved) => {
                        if (saved) setTrackingNote("");
                      });
                    }}
                  />
                </View>
              </>
            )}
          </SectionCard>

          <SectionCard title="Actions" subtitle="Use destructive actions carefully." icon="warning-outline">
            {booking.isDraft ? (
              <Text className="text-sm font-bold text-slate-500">There is no confirmed booking to cancel yet.</Text>
            ) : (
              <>
                <TextInput
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  placeholder="Cancellation reason"
                  placeholderTextColor="#94A3B8"
                  className="rounded-lg border border-svLine bg-svSoft px-3 py-3 text-svDark"
                />
                <View className="mt-3">
                  <ActionButton label="Cancel Booking" icon="ban" tone="danger" onPress={() => setShowCancel(true)} />
                </View>
              </>
            )}
          </SectionCard>
        </View>
        <DriverPicker
          visible={showDrivers}
          drivers={detail.drivers}
          onClose={() => setShowDrivers(false)}
          onSelect={(driver) => {
            setShowDrivers(false);
            void detail.assignDriver(driver.id);
          }}
        />
        <ConfirmDialog
          visible={showCancel}
          title="Cancel Booking"
          message="This will cancel the booking and record the cancellation reason."
          confirmLabel="Cancel Booking"
          onCancel={() => setShowCancel(false)}
          onConfirm={() => {
            setShowCancel(false);
            void detail.cancelBooking(cancelReason);
          }}
        />
      </ScrollView>
    </ScreenShell>
  );
}

function hasKnownField(booking: BookingDetail, key: keyof NonNullable<BookingDetail["fieldAvailability"]>): boolean {
  const available = booking.fieldAvailability?.[key];
  return typeof available === "boolean" ? available : true;
}

function missingLabel(booking: BookingDetail): string {
  return booking.isDraft ? "Not provided yet" : "Not recorded";
}

function valueOrFallback(
  value: string | null | undefined,
  booking: BookingDetail,
  key: keyof NonNullable<BookingDetail["fieldAvailability"]>
): string {
  if (!hasKnownField(booking, key)) return missingLabel(booking);
  const trimmed = value?.trim();
  return trimmed ? trimmed : missingLabel(booking);
}

function hasKnownPrice(booking: BookingDetail): boolean {
  return hasKnownField(booking, "price") && typeof (booking.totalPrice ?? booking.price) === "number";
}

function formatBookingMoney(booking: BookingDetail): string {
  return hasKnownPrice(booking) ? formatMoney(booking.totalPrice ?? booking.price) : "Not recorded";
}

function serviceLabel(booking: BookingDetail): string {
  const base = booking.serviceName ?? booking.serviceSlug;
  return booking.serviceVariant ? `${base} (${booking.serviceVariant})` : base;
}

function formatMoveSchedule(booking: BookingDetail): string {
  if (!hasKnownField(booking, "scheduledAt")) return missingLabel(booking);
  const dateValue = booking.scheduledDate ?? booking.scheduledAt ?? null;
  const date = formatScheduleDate(dateValue, missingLabel(booking));
  const slot = booking.timeSlot ?? booking.selectedTimeSlot;
  return `${date} - ${slot ? slotLabels[slot] ?? slot : "Time TBC"}`;
}

function formatFloor(value: number | null | undefined, booking: BookingDetail, key: "pickupFloor" | "dropoffFloor"): string {
  if (!hasKnownField(booking, key) || value === null || value === undefined) return missingLabel(booking);
  if (!Number.isInteger(value)) return "Invalid recorded floor";
  if (value < 0) return `Invalid recorded floor (${value})`;
  if (value === 0) return "Ground floor";
  const suffix = value === 1 ? "st" : value === 2 ? "nd" : value === 3 ? "rd" : "th";
  return `${value}${suffix} floor`;
}

function formatLift(value: boolean | null | undefined, booking: BookingDetail, key: "pickupHasLift" | "dropoffHasLift"): string {
  if (!hasKnownField(booking, key) || value === null || value === undefined) return missingLabel(booking);
  return value ? "Lift available" : "No lift";
}

function formatDistance(booking: BookingDetail): string {
  if (!hasKnownField(booking, "distanceMiles") || typeof booking.distanceMiles !== "number") return missingLabel(booking);
  return `${booking.distanceMiles.toFixed(1)} miles`;
}

function formatBooleanSelection(
  value: boolean | null | undefined,
  booking: BookingDetail,
  key: keyof NonNullable<BookingDetail["fieldAvailability"]>
): string {
  if (!hasKnownField(booking, key) || value === null || value === undefined) return missingLabel(booking);
  return value ? "Selected" : "Not selected";
}

function formatHelpers(booking: BookingDetail): string {
  if (!hasKnownField(booking, "helpersCount") || typeof booking.helpersCount !== "number") return missingLabel(booking);
  return `${booking.helpersCount} additional helper${booking.helpersCount === 1 ? "" : "s"}`;
}

function formatAssembly(booking: BookingDetail): string {
  if (!hasKnownField(booking, "needsAssembly") || booking.needsAssembly === null || booking.needsAssembly === undefined) {
    return missingLabel(booking);
  }
  if (!booking.needsAssembly) return "Not selected";
  if (!hasKnownField(booking, "assemblyType") || !booking.assemblyType) return "Selected";
  if (booking.assemblyType === "dismantle") return "Dismantling";
  if (booking.assemblyType === "assemble") return "Assembly";
  if (booking.assemblyType === "both") return "Dismantling and reassembly";
  return booking.assemblyType;
}

function formatAssemblyQuantity(booking: BookingDetail): string {
  if (!hasKnownField(booking, "assemblyQty") || typeof booking.assemblyQty !== "number") return missingLabel(booking);
  return `${booking.assemblyQty} item${booking.assemblyQty === 1 ? "" : "s"}`;
}

function formatPaymentStatus(booking: BookingDetail): string {
  if (booking.isDraft) return hasKnownPrice(booking) ? "Saved estimate, payment not received" : "Saved estimate, price not recorded";
  if (booking.isPaid && booking.paidAt) return "Paid";
  if (booking.isPaid) return "Paid, timestamp not recorded";
  return "Payment not received";
}

function inventoryUnavailable(booking: BookingDetail): boolean {
  return booking.fieldAvailability?.items === false;
}

function shouldShowDraftAccess(booking: BookingDetail): boolean {
  return Boolean(
    booking.isDraft &&
      (
        hasKnownField(booking, "hasNarrowAccess") ||
        hasKnownField(booking, "hasPermitZone")
      )
  );
}

function propertyTypeLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value === "house") return "House";
  if (value === "flat") return "Flat";
  if (value === "bungalow") return "Bungalow";
  if (value === "office") return "Office";
  if (value === "studio") return "Studio";
  return value;
}

function AddressCard({
  title,
  booking,
  side
}: {
  title: string;
  booking: BookingDetail;
  side: "pickup" | "dropoff";
}) {
  const addressKey = side === "pickup" ? "pickupAddress" : "dropoffAddress";
  const postcodeKey = side === "pickup" ? "pickupPostcode" : "dropoffPostcode";
  const floorKey = side === "pickup" ? "pickupFloor" : "dropoffFloor";
  const liftKey = side === "pickup" ? "pickupHasLift" : "dropoffHasLift";
  const propertyKey = side === "pickup" ? "pickupPropertyType" : "dropoffPropertyType";
  const carryKey = side === "pickup" ? "pickupCarryMetres" : "dropoffCarryMetres";
  const address = side === "pickup" ? booking.pickupAddress : booking.dropoffAddress;
  const postcode = side === "pickup" ? booking.pickupPostcode : booking.dropoffPostcode;
  const floor = side === "pickup" ? booking.pickupFloor : booking.dropoffFloor;
  const hasLift = side === "pickup" ? booking.pickupHasLift : booking.dropoffHasLift;
  const propertyType = side === "pickup" ? booking.pickupPropertyType : booking.dropoffPropertyType;
  const carryMetres = side === "pickup" ? booking.pickupCarryMetres : booking.dropoffCarryMetres;

  return (
    <View className="rounded-lg border border-slate-100 bg-svSoft px-3 py-3">
      <Text className="text-xs font-extrabold uppercase text-slate-400">{title}</Text>
      <InfoRow label="Address" value={valueOrFallback(address, booking, addressKey)} numberOfLines={12} selectable />
      <InfoRow label="Postcode" value={valueOrFallback(postcode, booking, postcodeKey)} selectable />
      {hasKnownField(booking, propertyKey) ? <InfoRow label="Property type" value={propertyTypeLabel(propertyType) ?? missingLabel(booking)} /> : null}
      <InfoRow label="Floor" value={formatFloor(floor, booking, floorKey)} />
      <InfoRow label="Lift" value={formatLift(hasLift, booking, liftKey)} />
      {hasKnownField(booking, carryKey) && typeof carryMetres === "number" ? (
        <InfoRow label="Carry distance" value={`${carryMetres} metres from parking`} />
      ) : null}
    </View>
  );
}

function DriverPicker({
  visible,
  drivers,
  onClose,
  onSelect
}: {
  visible: boolean;
  drivers: DriverListItem[];
  onClose: () => void;
  onSelect: (driver: DriverListItem) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Assign Driver" subtitle="Choose an active fleet member for this booking." onClose={onClose} />
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          contentContainerClassName={drivers.length === 0 ? "flex-1" : "p-4"}
          ListEmptyComponent={<EmptyState icon="people-outline" title="No drivers" message="Create drivers before assigning a booking." />}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelect(item)} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
                  <Ionicons name="person-outline" size={21} color={colors.svBrand} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-extrabold text-svDark" numberOfLines={1}>{item.user.name}</Text>
                  <Text className="text-sm font-bold text-slate-500">{item.vanSize}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
