import type { ReactNode } from "react";
import { RefreshControl, ScrollView, Text, View, type DimensionValue } from "react-native";
import { HeaderMetric, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { KPICard } from "@/components/KPICard";
import { LoadingView } from "@/components/LoadingView";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ServiceStat } from "@/models";
import { colors } from "@/theme/colors";
import { compactDateLabel, formatMoney } from "@/utils/format";

export function AnalyticsScreen() {
  const analytics = useAnalytics();
  const data = analytics.data;

  if (analytics.isLoading && !data.overview) return <LoadingView />;

  return (
    <ScreenShell>
      <ScrollView
        refreshControl={<RefreshControl refreshing={analytics.isLoading} onRefresh={() => void analytics.load()} />}
        contentContainerClassName="pb-10"
      >
        <ScreenHeader
          title="Analytics"
          subtitle="Revenue, booking volume, driver capacity, and service demand in one read."
          eyebrow="Performance"
          icon="analytics"
        >
          {data.overview ? (
            <View className="flex-row flex-wrap gap-2">
              <HeaderMetric label="Total bookings" value={String(data.overview.totalBookings)} icon="calendar" />
              <HeaderMetric label="Month revenue" value={formatMoney(data.overview.revenueThisMonth)} icon="trending-up" />
            </View>
          ) : null}
        </ScreenHeader>
        {analytics.error ? <ErrorBanner message={analytics.error} /> : null}
        <View className="gap-4 p-4">
          {data.overview ? (
            <View className="gap-4">
              <View className="flex-row gap-4">
                <KPICard title="Total Bookings" value={String(data.overview.totalBookings)} icon="calendar-outline" color={colors.svBrand} />
                <KPICard title="Month Revenue" value={formatMoney(data.overview.revenueThisMonth)} icon="cash-outline" color={colors.svGreen} />
              </View>
              <View className="flex-row gap-4">
                <KPICard title="Active Drivers" value={String(data.overview.activeDrivers)} icon="people-outline" color={colors.svOlive} />
                <KPICard title="Pending Jobs" value={String(data.overview.pendingJobs)} icon="briefcase-outline" color={colors.svWarning} />
              </View>
            </View>
          ) : null}
          <ChartCard title="Bookings per day" subtitle="Last 14 reporting points">
            <ColumnTrend data={data.bookingsPerDay} valueFor={(item) => item.count} labelFor={(item) => compactDateLabel(item.date ?? item.day)} color={colors.svBrand} />
          </ChartCard>
          <ChartCard title="Revenue per day" subtitle="Daily gross revenue">
            <ColumnTrend data={data.revenuePerDay} valueFor={(item) => item.revenue} labelFor={(item) => compactDateLabel(item.date ?? item.day)} color={colors.svGreen} />
          </ChartCard>
          <ChartCard title="By service" subtitle="Top 10 services by booking count">
            {data.services.length === 0 ? (
              <EmptyState icon="bar-chart-outline" title="No service data" message="Service stats will appear after bookings are created." />
            ) : (
              data.services.slice(0, 10).map((service) => <ServiceBar key={service.slug} service={service} max={Math.max(...data.services.map((item) => item.count), 1)} />)
            )}
          </ChartCard>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <SectionCard title={title} subtitle={subtitle} icon="stats-chart-outline">
      {children}
    </SectionCard>
  );
}

function ColumnTrend<T>({
  data,
  valueFor,
  labelFor,
  color
}: {
  data: T[];
  valueFor: (item: T) => number;
  labelFor: (item: T) => string;
  color: string;
}) {
  if (data.length === 0) {
    return <EmptyState icon="analytics-outline" title="No chart data" message="Chart data will appear here." />;
  }

  const max = Math.max(...data.map(valueFor), 1);
  const visible = data.slice(-14);

  return (
    <View className="h-56 flex-row items-end gap-2 rounded-lg bg-svSoft px-2 pb-2 pt-4">
      {visible.map((item, index) => {
        const height = Math.max(8, (valueFor(item) / max) * 160);
        return (
          <View key={`${labelFor(item)}-${index}`} className="flex-1 items-center justify-end">
            <View className="w-full rounded-t-lg" style={{ height, backgroundColor: color }} />
            <Text className="mt-2 text-[10px] font-bold text-slate-500" numberOfLines={1}>
              {labelFor(item)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ServiceBar({ service, max }: { service: ServiceStat; max: number }) {
  const width = `${Math.max(8, (service.count / max) * 100)}%` as DimensionValue;

  return (
    <View className="mb-4">
      <View className="mb-1 flex-row justify-between gap-3">
        <Text className="flex-1 text-sm font-extrabold text-svDark" numberOfLines={1}>{service.name ?? service.slug}</Text>
        <Text className="text-sm font-bold text-slate-500">{service.count}</Text>
      </View>
      <View className="h-3 rounded-lg bg-slate-100">
        <View className="h-3 rounded-lg bg-svBrand" style={{ width }} />
      </View>
      <Text className="mt-1 text-xs text-slate-500">{formatMoney(service.revenue)}</Text>
    </View>
  );
}
