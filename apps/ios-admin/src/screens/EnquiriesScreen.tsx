import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { ActionButton, HeaderMetric, InfoRow, ModalHeader, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FilterChips, type FilterChipOption } from "@/components/FilterChips";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useEnquiries } from "@/hooks/useEnquiries";
import type { EnquiryDetail, EnquiryListItem, EnquiryStatus } from "@/models";
import { colors } from "@/theme/colors";
import { formatDate, formatMoney } from "@/utils/format";
import { enquiryStatusMeta } from "@/utils/status";

const enquiryFilters: FilterChipOption<EnquiryStatus>[] = [
  { label: "All", value: null },
  { label: "New", value: "new" },
  { label: "Quoted", value: "quoted" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "declined" }
];

export function EnquiriesScreen() {
  const enquiries = useEnquiries();

  if (enquiries.isLoading && enquiries.enquiries.length === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Enquiries"
        subtitle="Quote and progress European removals leads from first contact to acceptance."
        eyebrow="Sales"
        icon="mail"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Loaded" value={String(enquiries.enquiries.length)} icon="mail" />
          <HeaderMetric label="Filter" value={enquiries.status ? enquiryStatusMeta(enquiries.status).label : "All enquiries"} icon="funnel" />
        </View>
      </ScreenHeader>
      {enquiries.error ? <ErrorBanner message={enquiries.error} /> : null}
      <FilterChips options={enquiryFilters} value={enquiries.status} onChange={enquiries.setStatus} />
      <FlatList
        data={enquiries.enquiries}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={enquiries.isLoading} onRefresh={() => void enquiries.load()} />}
        contentContainerClassName={enquiries.enquiries.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="mail-outline" title="No enquiries" message="European removals enquiries will appear here." />}
        renderItem={({ item }) => <EnquiryRow enquiry={item} onPress={() => void enquiries.openDetail(item.id)} />}
      />
      <EnquiryModal
        enquiry={enquiries.selected}
        onClose={() => enquiries.setSelected(null)}
        onSave={(id, status, price, notes) => {
          enquiries.setSelected(null);
          void enquiries.updateStatus(id, status, price, notes);
        }}
        onSendQuote={(id) => {
          enquiries.setSelected(null);
          void enquiries.sendQuote(id);
        }}
      />
    </ScreenShell>
  );
}

function EnquiryRow({ enquiry, onPress }: { enquiry: EnquiryListItem; onPress: () => void }) {
  const meta = enquiryStatusMeta(enquiry.status);

  return (
    <Pressable onPress={onPress} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
            <Ionicons name="earth-outline" size={21} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-svDark" numberOfLines={1}>{enquiry.customerName}</Text>
            <Text className="text-sm text-slate-500" numberOfLines={1}>{enquiry.customerEmail}</Text>
          </View>
        </View>
        <StatusBadge label={meta.label} color={meta.color} />
      </View>
      <View className="mt-4 gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="navigate-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm font-bold text-svDark" numberOfLines={1}>{enquiry.toCity}, {enquiry.toCountry}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={15} color={colors.muted} />
          <Text className="text-sm text-slate-500">{formatDate(enquiry.createdAt)}</Text>
        </View>
      </View>
      {enquiry.quotedPrice ? (
        <View className="mt-4 border-t border-slate-100 pt-3">
          <Text className="text-xs font-bold uppercase text-slate-400">Quoted price</Text>
          <Text className="mt-0.5 font-extrabold text-svGreen">{formatMoney(enquiry.quotedPrice)}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function EnquiryModal({
  enquiry,
  onClose,
  onSave,
  onSendQuote
}: {
  enquiry: EnquiryDetail | null;
  onClose: () => void;
  onSave: (id: string, status: EnquiryStatus, price?: number, notes?: string) => void;
  onSendQuote: (id: string) => void;
}) {
  const [status, setStatus] = useState<EnquiryStatus>("new");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmSend, setConfirmSend] = useState(false);

  useEffect(() => {
    if (!enquiry) return;
    setStatus(enquiry.status);
    setPrice(enquiry.quotedPrice ? String(enquiry.quotedPrice) : "");
    setNotes(enquiry.adminNotes ?? "");
  }, [enquiry]);

  if (!enquiry) return null;

  const priceValue = price.length > 0 ? Number(price) : undefined;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Enquiry" subtitle={enquiry.customerName} onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Customer" icon="person-outline">
            <InfoRow label="Name" value={enquiry.customerName} />
            <InfoRow label="Email" value={enquiry.customerEmail} />
            <InfoRow label="Phone" value={enquiry.customerPhone} />
          </SectionCard>
          <SectionCard title="Move details" icon="earth-outline">
            <InfoRow label="From" value={enquiry.fromAddress} />
            <InfoRow label="To" value={`${enquiry.toCity}, ${enquiry.toCountry}`} />
            <InfoRow label="Bedrooms" value={String(enquiry.bedrooms)} />
            <InfoRow label="Packing" value={enquiry.needsPacking ? "Yes" : "No"} />
            <InfoRow label="Storage" value={enquiry.needsStorage ? "Yes" : "No"} />
            <InfoRow label="Customer notes" value={enquiry.notes ?? "No customer notes"} />
          </SectionCard>
          <SectionCard title="Quote control" icon="pricetag-outline">
            <FilterChips options={enquiryFilters.filter((option) => option.value !== null)} value={status} onChange={(value) => value ? setStatus(value) : undefined} />
            <TextInput value={price} onChangeText={setPrice} placeholder="Quoted price" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" className="mt-3 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={notes} onChangeText={setNotes} placeholder="Admin notes" placeholderTextColor="#94A3B8" multiline className="mt-3 min-h-24 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
          </SectionCard>
          <ActionButton label="Save Enquiry" icon="save" onPress={() => onSave(enquiry.id, status, priceValue, notes.trim() || undefined)} />
          {status === "quoted" ? (
            <ActionButton label="Send Quote Email" icon="paper-plane" tone="dark" onPress={() => setConfirmSend(true)} />
          ) : null}
        </ScrollView>
        <ConfirmDialog
          visible={confirmSend}
          title="Send Quote Email"
          confirmLabel="Send"
          onCancel={() => setConfirmSend(false)}
          onConfirm={() => {
            setConfirmSend(false);
            onSendQuote(enquiry.id);
          }}
        />
      </View>
    </Modal>
  );
}
