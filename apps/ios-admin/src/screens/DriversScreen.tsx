import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { ActionButton, HeaderMetric, ModalHeader, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FilterChips, type FilterChipOption } from "@/components/FilterChips";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useDrivers } from "@/hooks/useDrivers";
import type { DriverListItem, VanSize } from "@/models";
import { colors } from "@/theme/colors";
import { formatMoney } from "@/utils/format";

const vanSizes: FilterChipOption<VanSize>[] = [
  { label: "Small", value: "SMALL" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Large", value: "LARGE" },
  { label: "Luton", value: "LUTON" }
];

export function DriversScreen() {
  const router = useRouter();
  const drivers = useDrivers();
  const [showAdd, setShowAdd] = useState(false);

  if (drivers.isLoading && drivers.drivers.length === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Drivers"
        subtitle="Manage active vans, unpaid earnings, and driver access."
        eyebrow="Fleet"
        icon="people"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Drivers" value={String(drivers.drivers.length)} icon="people" />
          <HeaderMetric label="Active" value={String(drivers.drivers.filter((driver) => driver.isActive).length)} icon="radio-button-on" />
        </View>
      </ScreenHeader>
      {drivers.error ? <ErrorBanner message={drivers.error} /> : null}
      <View className="px-4 py-4">
        <ActionButton label="Create Driver" icon="person-add" onPress={() => setShowAdd(true)} />
      </View>
      <FlatList
        data={drivers.drivers}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={drivers.isLoading} onRefresh={() => void drivers.load()} />}
        contentContainerClassName={drivers.drivers.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="people-outline" title="No drivers" message="Created drivers will appear here." />}
        renderItem={({ item }) => (
          <DriverRow
            driver={item}
            onPress={() => router.push(`/drivers/${item.id}`)}
            onToggle={() => void drivers.toggleActive(item)}
          />
        )}
      />
      <AddDriverModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={(input) => {
          setShowAdd(false);
          void drivers.createDriver(input);
        }}
      />
    </ScreenShell>
  );
}

function DriverRow({ driver, onPress, onToggle }: { driver: DriverListItem; onPress: () => void; onToggle: () => void }) {
  return (
    <Pressable onPress={onPress} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-lg bg-svBrandSubtle">
            <Ionicons name="person-outline" size={22} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-svDark" numberOfLines={1}>{driver.user.name}</Text>
            <Text className="text-sm text-slate-500" numberOfLines={1}>{driver.user.email}</Text>
          </View>
        </View>
        <Switch value={driver.isActive} onValueChange={onToggle} trackColor={{ true: colors.svGreen }} />
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View className="flex-row items-center gap-2">
        <StatusBadge label={driver.vanSize} color={colors.amber} />
        {(driver.unpaidEarnings ?? 0) > 0 ? (
          <Text className="text-sm font-extrabold text-rose-600">Unpaid {formatMoney(driver.unpaidEarnings)}</Text>
        ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    </Pressable>
  );
}

function AddDriverModal({
  visible,
  onClose,
  onSave
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (input: { name: string; email: string; phone?: string; vanSize: VanSize }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vanSize, setVanSize] = useState<VanSize>("MEDIUM");
  const canSave = name.trim().length > 0 && email.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Create Driver" subtitle="Add a fleet account and choose the van size." onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Driver details" icon="id-card-outline">
            <View className="gap-3">
              <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#94A3B8" className="rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
              <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#94A3B8" autoCapitalize="none" keyboardType="email-address" className="rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
              <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" placeholderTextColor="#94A3B8" keyboardType="phone-pad" className="rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            </View>
          </SectionCard>
          <SectionCard title="Van size" icon="bus-outline">
            <FilterChips options={vanSizes} value={vanSize} onChange={(value) => value ? setVanSize(value) : undefined} />
          </SectionCard>
          <Pressable
            disabled={!canSave}
            onPress={() => onSave({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, vanSize })}
            className={canSave ? "rounded-lg bg-svBrand py-4" : "rounded-lg bg-slate-200 py-4"}
          >
            <Text className={canSave ? "text-center font-extrabold text-white" : "text-center font-extrabold text-slate-500"}>Create Driver</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}
