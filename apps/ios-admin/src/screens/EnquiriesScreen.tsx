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
import { useEnquiries, useStorageEnquiries } from "@/hooks/useEnquiries";
import type {
  EnquiryDetail,
  EnquiryListItem,
  EnquiryStatus,
  StorageEnquiryDetail,
  StorageEnquiryListItem,
  StorageEnquiryStatus
} from "@/models";
import { colors } from "@/theme/colors";
import { formatDate, formatMoney } from "@/utils/format";
import { enquiryStatusMeta, storageEnquiryStatusMeta } from "@/utils/status";

type EnquiryCategory = "european" | "storage";

const categoryFilters: FilterChipOption<EnquiryCategory>[] = [
  { label: "European", value: "european" },
  { label: "Storage", value: "storage" }
];

const enquiryFilters: FilterChipOption<EnquiryStatus>[] = [
  { label: "All", value: null },
  { label: "New", value: "new" },
  { label: "Quoted", value: "quoted" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "declined" }
];

const storageFilters: FilterChipOption<StorageEnquiryStatus>[] = [
  { label: "All", value: null },
  { label: "New", value: "new" },
  { label: "Review", value: "under_review" },
  { label: "Quoted", value: "quoted" },
  { label: "Closed", value: "closed" }
];

export function EnquiriesScreen() {
  const [category, setCategory] = useState<EnquiryCategory>("european");
  const enquiries = useEnquiries();
  const storage = useStorageEnquiries();
  const activeLoading = category === "european" ? enquiries.isLoading : storage.isLoading;
  const activeCount = category === "european" ? enquiries.enquiries.length : storage.enquiries.length;
  const activeError = category === "european" ? enquiries.error : storage.error;

  if (activeLoading && activeCount === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Enquiries"
        subtitle={category === "european" ? "Quote and progress European removals leads." : "Review storage quote requests without creating bookings."}
        eyebrow="Sales"
        icon="mail"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Loaded" value={String(activeCount)} icon="mail" />
          <HeaderMetric
            label="Category"
            value={category === "european" ? "European" : "Storage"}
            icon={category === "european" ? "earth" : "archive"}
          />
        </View>
      </ScreenHeader>
      {activeError ? <ErrorBanner message={activeError} /> : null}
      <FilterChips options={categoryFilters} value={category} onChange={(value) => value ? setCategory(value) : undefined} />
      {category === "european" ? (
        <>
          <FilterChips options={enquiryFilters} value={enquiries.status} onChange={enquiries.setStatus} />
          <FlatList
            data={enquiries.enquiries}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={enquiries.isLoading} onRefresh={() => void enquiries.load()} />}
            contentContainerClassName={enquiries.enquiries.length === 0 ? "flex-1" : "p-4"}
            ListEmptyComponent={<EmptyState icon="mail-outline" title="No European enquiries" message="European removals enquiries will appear here." />}
            renderItem={({ item }) => <EnquiryRow enquiry={item} onPress={() => void enquiries.openDetail(item.id)} />}
          />
        </>
      ) : (
        <>
          <FilterChips options={storageFilters} value={storage.status} onChange={storage.setStatus} />
          <FlatList
            data={storage.enquiries}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={storage.isLoading} onRefresh={() => void storage.load()} />}
            contentContainerClassName={storage.enquiries.length === 0 ? "flex-1" : "p-4"}
            ListEmptyComponent={<EmptyState icon="archive-outline" title="No storage enquiries" message="Storage quote requests will appear here." />}
            renderItem={({ item }) => <StorageEnquiryRow enquiry={item} onPress={() => void storage.openDetail(item.id)} />}
          />
        </>
      )}
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
      <StorageEnquiryModal
        enquiry={storage.selected}
        onClose={() => storage.setSelected(null)}
        onSave={(id, status, quote) => {
          storage.setSelected(null);
          void storage.updateStatus(id, status, quote);
        }}
        onSendQuote={(id, quote) => {
          storage.setSelected(null);
          void storage.sendQuote(id, quote);
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

function storageName(enquiry: Pick<StorageEnquiryListItem, "firstName" | "lastName">): string {
  return [enquiry.firstName, enquiry.lastName ?? ""].map((part) => part.trim()).filter(Boolean).join(" ");
}

function human(value?: string | null): string {
  return value ? value.replace(/_/g, " ") : "Not provided";
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && Array.isArray(value) === false ? value as Record<string, unknown> : null;
}

function objectText(value: unknown, key: string): string {
  const object = objectValue(value);
  const item = object?.[key];
  return typeof item === "string" && item.length > 0 ? item : "Not provided";
}

function boolText(value: boolean): string {
  return value ? "Yes" : "No";
}

function optionalMoney(value?: number | null): string {
  return value != null && value > 0 ? formatMoney(value) : "Not set";
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function StorageEnquiryRow({ enquiry, onPress }: { enquiry: StorageEnquiryListItem; onPress: () => void }) {
  const meta = storageEnquiryStatusMeta(enquiry.status);

  return (
    <Pressable onPress={onPress} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
            <Ionicons name="archive-outline" size={21} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-svDark" numberOfLines={1}>{storageName(enquiry)}</Text>
            <Text className="text-xs font-bold text-slate-400" numberOfLines={1}>{enquiry.reference}</Text>
          </View>
        </View>
        <StatusBadge label={meta.label} color={meta.color} />
      </View>
      <View className="mt-4 gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm font-bold text-svDark" numberOfLines={1}>{human(enquiry.estimatedUnitSize)}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm text-slate-500" numberOfLines={1}>{enquiry.collectionPostcode}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={15} color={colors.muted} />
          <Text className="text-sm text-slate-500">{formatDate(enquiry.createdAt)}</Text>
        </View>
      </View>
      {enquiry.quotedStoragePrice || enquiry.quotedTransportPrice ? (
        <View className="mt-4 border-t border-slate-100 pt-3">
          <Text className="text-xs font-bold uppercase text-slate-400">Quote</Text>
          <Text className="mt-0.5 font-extrabold text-svGreen">
            Transport {optionalMoney(enquiry.quotedTransportPrice)} · Storage {optionalMoney(enquiry.quotedStoragePrice)}
          </Text>
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
        <ModalHeader title="European enquiry" subtitle={enquiry.customerName} onClose={onClose} />
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

function StorageEnquiryModal({
  enquiry,
  onClose,
  onSave,
  onSendQuote
}: {
  enquiry: StorageEnquiryDetail | null;
  onClose: () => void;
  onSave: (
    id: string,
    status: StorageEnquiryStatus,
    quote: {
      quotedTransportPrice?: number | null;
      quotedStoragePrice?: number | null;
      quotePeriod?: string | null;
      quoteNotes?: string | null;
      adminNotes?: string | null;
    }
  ) => void;
  onSendQuote: (
    id: string,
    quote: {
      quotedTransportPrice?: number | null;
      quotedStoragePrice?: number | null;
      quotePeriod?: string | null;
      quoteNotes?: string | null;
    }
  ) => void;
}) {
  const [status, setStatus] = useState<StorageEnquiryStatus>("new");
  const [transportPrice, setTransportPrice] = useState("");
  const [storagePrice, setStoragePrice] = useState("");
  const [quotePeriod, setQuotePeriod] = useState("month");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [confirmSend, setConfirmSend] = useState(false);

  useEffect(() => {
    if (!enquiry) return;
    setStatus(enquiry.status);
    setTransportPrice(enquiry.quotedTransportPrice ? String(enquiry.quotedTransportPrice) : "");
    setStoragePrice(enquiry.quotedStoragePrice ? String(enquiry.quotedStoragePrice) : "");
    setQuotePeriod(enquiry.quotePeriod ?? "month");
    setQuoteNotes(enquiry.quoteNotes ?? "");
    setAdminNotes(enquiry.adminNotes ?? "");
  }, [enquiry]);

  if (!enquiry) return null;

  const access = objectValue(enquiry.collectionAccess);
  const facility = objectValue(enquiry.storageFacility);
  const quote = {
    quotedTransportPrice: parsePrice(transportPrice),
    quotedStoragePrice: parsePrice(storagePrice),
    quotePeriod,
    quoteNotes: quoteNotes.trim() || null
  };
  const hasQuote = Boolean((quote.quotedTransportPrice ?? 0) > 0 || (quote.quotedStoragePrice ?? 0) > 0);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Storage enquiry" subtitle={enquiry.reference} onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Customer" icon="person-outline">
            <InfoRow label="Name" value={storageName(enquiry)} />
            <InfoRow label="Email" value={enquiry.customerEmail} />
            <InfoRow label="Phone" value={enquiry.customerPhone} />
            <InfoRow label="Reference" value={enquiry.reference} mono />
          </SectionCard>
          <SectionCard title="Storage request" icon="archive-outline">
            <InfoRow label="Start" value={enquiry.storageStartKind === "known" && enquiry.storageStartDate ? formatDate(enquiry.storageStartDate) : "Not decided"} />
            <InfoRow label="Duration" value={human(enquiry.storageDuration)} />
            <InfoRow label="Estimated size" value={human(enquiry.estimatedUnitSize)} />
            <InfoRow label="Items" value={enquiry.itemDescription} />
            <InfoRow label="Packing" value={boolText(enquiry.needsPacking)} />
            <InfoRow label="Dismantling" value={boolText(enquiry.needsDismantling)} />
            <InfoRow label="Customer notes" value={enquiry.notes ?? "No customer notes"} />
          </SectionCard>
          <SectionCard title="Collection access" icon="location-outline">
            <InfoRow label="Transport needed" value={boolText(enquiry.needsCollectionTransport)} />
            <InfoRow label="Collection" value={[enquiry.collectionAddress, enquiry.collectionPostcode].filter(Boolean).join(", ")} />
            <InfoRow label="Property" value={human(objectText(access, "propertyType"))} />
            <InfoRow label="Floor" value={String(access?.floor ?? "Not provided")} />
            <InfoRow label="Lift" value={typeof access?.hasLift === "boolean" ? boolText(access.hasLift) : "Not provided"} />
            <InfoRow label="Carry distance" value={access?.carryDistanceMetres ? `${access.carryDistanceMetres}m` : "Not provided"} />
            <InfoRow label="Narrow access" value={boolText(access?.narrowAccess === true)} />
            <InfoRow label="Parking restriction" value={boolText(access?.permitOrRestrictedParking === true)} />
            <InfoRow label="Access notes" value={objectText(access, "accessNotes")} />
          </SectionCard>
          <SectionCard title="Storage and return" icon="swap-horizontal-outline">
            <InfoRow label="Facility known" value={boolText(enquiry.storageFacilityKnown)} />
            <InfoRow label="Facility" value={enquiry.storageFacilityKnown ? [objectText(facility, "address"), objectText(facility, "postcode")].filter((value) => value !== "Not provided").join(", ") || "Not provided" : "Not decided"} />
            <InfoRow label="Return transport" value={boolText(enquiry.needsReturnTransport)} />
            <InfoRow label="Return destination" value={enquiry.returnDestinationKnown ? [enquiry.returnAddress, enquiry.returnPostcode].filter(Boolean).join(", ") : "Not decided"} />
            <InfoRow label="Return date" value={enquiry.returnDateKind === "known" && enquiry.returnDate ? formatDate(enquiry.returnDate) : enquiry.needsReturnTransport ? "Not decided" : "Not requested"} />
          </SectionCard>
          <SectionCard title="Quote control" icon="pricetag-outline">
            <FilterChips options={storageFilters.filter((option) => option.value !== null)} value={status} onChange={(value) => value ? setStatus(value) : undefined} />
            <TextInput value={transportPrice} onChangeText={setTransportPrice} placeholder="Transport price" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" className="mt-3 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={storagePrice} onChangeText={setStoragePrice} placeholder="Storage price" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" className="mt-3 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={quotePeriod} onChangeText={setQuotePeriod} placeholder="Quote period: week, month, total or custom" placeholderTextColor="#94A3B8" className="mt-3 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={quoteNotes} onChangeText={setQuoteNotes} placeholder="Quote notes for customer" placeholderTextColor="#94A3B8" multiline className="mt-3 min-h-24 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={adminNotes} onChangeText={setAdminNotes} placeholder="Admin notes" placeholderTextColor="#94A3B8" multiline className="mt-3 min-h-24 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            {enquiry.quoteSentAt ? <InfoRow label="Quote sent" value={formatDate(enquiry.quoteSentAt)} /> : null}
            {enquiry.quoteEmailStatus === "failed" && enquiry.quoteEmailError ? <InfoRow label="Email error" value={enquiry.quoteEmailError} /> : null}
          </SectionCard>
          <ActionButton
            label="Save Storage Enquiry"
            icon="save"
            onPress={() => onSave(enquiry.id, status, { ...quote, adminNotes: adminNotes.trim() || null })}
          />
          <ActionButton label="Send Quote Email" icon="paper-plane" tone="dark" disabled={!hasQuote} onPress={() => setConfirmSend(true)} />
        </ScrollView>
        <ConfirmDialog
          visible={confirmSend}
          title="Send Storage Quote"
          confirmLabel="Send"
          onCancel={() => setConfirmSend(false)}
          onConfirm={() => {
            setConfirmSend(false);
            onSendQuote(enquiry.id, quote);
          }}
        />
      </View>
    </Modal>
  );
}
