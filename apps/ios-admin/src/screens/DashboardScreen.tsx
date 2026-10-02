import { RefreshControl, ScrollView, Text, View } from "react-native";
import { HeaderMetric, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { KPICard } from "@/components/KPICard";
import { LoadingView } from "@/components/LoadingView";
import { useDashboard } from "@/hooks/useDashboard";
import { colors } from "@/theme/colors";
import { formatMoney } from "@/utils/format";

export function DashboardScreen() {
  const { data, isLoading, error, load } = useDashboard();

  if (isLoading && !data) return <LoadingView />;

  return (
    <ScreenShell>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void load()} />}
        contentContainerClassName="pb-8"
      >
        <ScreenHeader
          title="Command Centre"
          subtitle="Live admin visibility across bookings, revenue, drivers, jobs, and traffic."
          eyebrow="SpeedyVan Admin"
          icon="speedometer"
        >
          {data ? (
            <View className="flex-row flex-wrap gap-2">
              <HeaderMetric label="Today" value={`${data.bookingsToday} bookings`} icon="calendar" />
              <HeaderMetric label="Revenue" value={formatMoney(data.revenueThisMonth)} icon="cash" />
            </View>
          ) : null}
        </ScreenHeader>
        {error ? <ErrorBanner message={error} /> : null}
        {!data ? (
          <EmptyState icon="analytics-outline" title="No dashboard data" message="Pull to refresh once analytics are available." />
        ) : (
          <View className="gap-3 p-4">
            <View className="flex-row gap-3">
              <KPICard title="Bookings Today" value={String(data.bookingsToday)} icon="calendar-outline" color={colors.svBrand} />
              <KPICard title="This Month" value={String(data.bookingsThisMonth)} icon="bar-chart-outline" color={colors.svGold} />
            </View>
            <View className="flex-row gap-3">
              <KPICard title="Revenue This Month" value={formatMoney(data.revenueThisMonth)} icon="cash-outline" color={colors.svGreen} />
              <KPICard title="Active Drivers" value={String(data.activeDrivers)} icon="people-outline" color={colors.svOlive} />
            </View>
            <View className="flex-row gap-3">
              <KPICard title="Pending Jobs" value={String(data.pendingJobs)} icon="briefcase-outline" color={colors.svWarning} />
              <KPICard title="Visitors Today" value={String(data.visitorsToday)} icon="eye-outline" color={colors.orange} />
            </View>
            <SectionCard title="Operations Pulse" subtitle="Work that needs attention right now." icon="pulse-outline">
              <View className="flex-row gap-3">
                <View className="flex-1 items-center rounded-2xl py-4" style={{ backgroundColor: `${colors.svWarning}12` }}>
                  <Text className="text-3xl font-extrabold text-svDark" style={{ letterSpacing: -1 }}>{data.pendingJobs}</Text>
                  <Text className="mt-1 text-[10px] font-extrabold uppercase" style={{ color: colors.svWarning, letterSpacing: 0.5 }}>Jobs queue</Text>
                </View>
                <View className="flex-1 items-center rounded-2xl py-4" style={{ backgroundColor: `${colors.svGreen}10` }}>
                  <Text className="text-3xl font-extrabold text-svDark" style={{ letterSpacing: -1 }}>{data.activeDrivers}</Text>
                  <Text className="mt-1 text-[10px] font-extrabold uppercase" style={{ color: colors.svGreen, letterSpacing: 0.5 }}>Drivers online</Text>
                </View>
              </View>
            </SectionCard>
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
