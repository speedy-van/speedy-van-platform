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
import type { BookingStatus, DriverListItem } from "@/models";
import { colors } from "@/theme/colors";
import { formatDate, formatDateTime, formatMoney } from "@/utils/format";
import { bookingStatusMeta } from "@/utils/status";

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

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
        <EmptyState icon="document-text-outline" title="Booking not found" message="This booking could not be loaded." />
      </ScreenShell>
    );
  }

  const booking = detail.booking;
  const meta = bookingStatusMeta(booking.status);
  const date = booking.scheduledDate ?? booking.scheduledAt;
  const total = formatMoney(booking.totalPrice ?? booking.price);

  return (
    <ScreenShell>
      <ScrollView
        refreshControl={<RefreshControl refreshing={detail.isLoading} onRefresh={() => void detail.load()} />}
        contentContainerClassName="pb-10"
      >
        <ScreenHeader
          title={booking.reference}
          subtitle={booking.customerName}
          eyebrow="Booking Detail"
          icon="receipt"
          right={<StatusBadge label={meta.label} color={meta.color} />}
        >
          <View className="flex-row flex-wrap gap-2">
            <HeaderMetric label="Total" value={total} icon="cash" />
            <HeaderMetric label="Driver" value={booking.driver?.user.name ?? "Unassigned"} icon="person" />
          </View>
        </ScreenHeader>
        {detail.error ? <ErrorBanner message={detail.error} /> : null}
        <View className="gap-4 p-4">
          <SectionCard title="Customer" subtitle="Primary contact for this move." icon="person-outline">
            <InfoRow label="Name" value={booking.customerName} />
            <InfoRow label="Email" value={booking.customerEmail} />
            <InfoRow label="Phone" value={booking.customerPhone} />
          </SectionCard>

          <SectionCard title="Booking" subtitle="Service, schedule, value, and status control." icon="calendar-outline">
            <InfoRow label="Reference" value={booking.reference} mono />
            <InfoRow label="Service" value={booking.serviceName ?? booking.serviceSlug} />
            <InfoRow label="Date" value={`${formatDate(date)} - ${booking.timeSlot ?? booking.selectedTimeSlot ?? "Time TBC"}`} />
            <InfoRow label="Total" value={total} accent />
            <View className="mt-3">
              <StatusBadge label={meta.label} color={meta.color} />
            </View>
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
                      borderColor: selected ? `${statusMeta.color}66` : colors.border
                    }}
                  >
                    <Text className="text-xs font-extrabold uppercase" style={{ color: statusMeta.color }}>
                      {statusMeta.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SectionCard>

          <SectionCard title="Driver" subtitle="Assign or reassign this move." icon="car-outline">
            <InfoRow label="Assigned" value={booking.driver?.user.name ?? "Unassigned"} />
            <ActionButton label="Assign Driver" icon="person-add" onPress={() => setShowDrivers(true)} />
          </SectionCard>

          <SectionCard title="Extras" subtitle="Optional add-ons selected by the customer." icon="add-circle-outline">
            {!booking.helpersCount && !booking.needsPacking && !booking.needsAssembly ? (
              <Text className="text-sm font-bold text-slate-500">No extras added</Text>
            ) : (
              <View className="gap-2">
                {(booking.helpersCount ?? 0) > 0 && (
                  <InfoRow label="Extra helper" value={`×${booking.helpersCount}`} />
                )}
                {booking.needsPacking && <InfoRow label="Packing service" value="Yes" />}
                {booking.needsAssembly && (
                  <InfoRow
                    label="Assembly"
                    value={`${booking.assemblyType === "dismantle" ? "Dismantling only" : booking.assemblyType === "assemble" ? "Assembly only" : booking.assemblyType === "both" ? "Dismantle + reassemble" : "Yes"}${booking.assemblyQty && booking.assemblyQty > 1 ? ` ×${booking.assemblyQty} items` : ""}`}
                  />
                )}
              </View>
            )}
          </SectionCard>

          <SectionCard title="Items" subtitle="Customer inventory for the move." icon="cube-outline">
            {booking.items.length === 0 ? (
              <Text className="text-sm font-bold text-slate-500">No items listed</Text>
            ) : (
              <View className="gap-2">
                {booking.items.map((item) => (
                  <View key={item.id} className="flex-row items-center justify-between rounded-lg bg-svSoft px-3 py-3">
                    <Text className="flex-1 text-sm font-extrabold text-svDark" numberOfLines={1}>{item.name}</Text>
                    <Text className="rounded-lg bg-white px-2 py-1 text-xs font-extrabold text-slate-600">Qty {item.quantity}</Text>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          <SectionCard title="Tracking" subtitle="Internal notes and customer movement history." icon="trail-sign-outline">
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
                      <Text className="mt-1 text-xs font-bold text-slate-500">{formatDateTime(event.createdAt)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
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
                  void detail.addTrackingNote(trackingNote.trim());
                  setTrackingNote("");
                }}
              />
            </View>
          </SectionCard>

          <SectionCard title="Actions" subtitle="Use destructive actions carefully." icon="warning-outline">
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
