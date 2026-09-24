import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ActionButton, HeaderMetric, InfoRow, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useDriverDetail } from "@/hooks/useDrivers";
import type { DriverListItem } from "@/models";
import { colors } from "@/theme/colors";
import { formatMoney } from "@/utils/format";

export function DriverDetailScreen({ driver }: { driver: DriverListItem }) {
  const detail = useDriverDetail(driver.id);
  const [confirmPaid, setConfirmPaid] = useState(false);

  if (detail.isLoading && !detail.earnings) return <LoadingView />;

  const unpaid = detail.earnings?.unpaid ?? 0;

  return (
    <ScreenShell>
      <ScrollView contentContainerClassName="pb-10">
        <ScreenHeader
          title={driver.user.name}
          subtitle={driver.user.email}
          eyebrow="Driver Profile"
          icon="person"
          right={<StatusBadge label={driver.isActive ? "Active" : "Inactive"} color={driver.isActive ? colors.svGreen : colors.muted} />}
        >
          <View className="flex-row flex-wrap gap-2">
            <HeaderMetric label="Van" value={driver.vanSize} icon="car" />
            <HeaderMetric label="Unpaid" value={formatMoney(unpaid)} icon="wallet" />
          </View>
        </ScreenHeader>
        {detail.error ? <ErrorBanner message={detail.error} /> : null}
        <View className="gap-4 p-4">
          <SectionCard title="Info" subtitle="Driver account and vehicle details." icon="id-card-outline">
            <InfoRow label="Name" value={driver.user.name} />
            <InfoRow label="Email" value={driver.user.email} />
            <InfoRow label="Phone" value={driver.user.phone ?? "Not provided"} />
            <InfoRow label="Van Size" value={driver.vanSize} />
            <View className="mt-3">
              <StatusBadge label={driver.isActive ? "Active" : "Inactive"} color={driver.isActive ? colors.svGreen : colors.muted} />
            </View>
          </SectionCard>

          <SectionCard title="Earnings" subtitle="Driver earning totals and payout status." icon="cash-outline">
            <InfoRow label="Total Earned" value={formatMoney(detail.earnings?.total)} accent />
            <InfoRow label="This Month" value={formatMoney(detail.earnings?.thisMonth)} />
            <InfoRow label="Unpaid" value={formatMoney(detail.earnings?.unpaid)} />
            <InfoRow label="Paid" value={formatMoney(detail.earnings?.paid)} />
            {unpaid > 0 ? (
              <View className="mt-3">
                <ActionButton label="Mark Unpaid as Paid" icon="checkmark-circle" onPress={() => setConfirmPaid(true)} />
              </View>
            ) : null}
          </SectionCard>

          <SectionCard title="Actions" subtitle="Account controls for support and access recovery." icon="settings-outline">
            <ActionButton label="Reset Password" icon="key" tone="dark" onPress={() => void detail.resetPassword()} />
            {detail.tempPassword ? (
              <View className="mt-3 rounded-lg border border-svLine bg-svSoft p-3">
                <Text className="text-xs font-extrabold uppercase text-slate-500">Temporary password</Text>
                <Text className="mt-1 font-mono text-base font-extrabold text-svDark">{detail.tempPassword}</Text>
              </View>
            ) : null}
          </SectionCard>
        </View>
        <ConfirmDialog
          visible={confirmPaid}
          title="Mark Unpaid as Paid"
          message="This will mark the driver's current unpaid balance as paid."
          confirmLabel="Mark Paid"
          destructive={false}
          onCancel={() => setConfirmPaid(false)}
          onConfirm={() => {
            setConfirmPaid(false);
            void detail.markPaid();
          }}
        />
      </ScrollView>
    </ScreenShell>
  );
}
