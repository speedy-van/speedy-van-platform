import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { RefreshControl, ScrollView, Text, View, type DimensionValue } from "react-native";
import { HeaderMetric, InfoRow, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { KPICard } from "@/components/KPICard";
import { LoadingView } from "@/components/LoadingView";
import { useVisitors } from "@/hooks/useVisitors";
import type { RealtimeVisitor, VisitorEvent, VisitorWeekEntry } from "@/models";
import { colors } from "@/theme/colors";
import { compactDateLabel, formatDateTime } from "@/utils/format";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function VisitorsScreen() {
  const visitors = useVisitors();
  const data = visitors.data;
  const activeVisitors = data.realtime?.visitors ?? [];

  if (visitors.isLoading && data.realtime === null) return <LoadingView label="Loading website visitors..." />;

  return (
    <ScreenShell>
      <ScrollView
        refreshControl={<RefreshControl refreshing={visitors.isLoading} onRefresh={() => void visitors.load()} />}
        contentContainerClassName="pb-10"
      >
        <ScreenHeader
          title="Visitors"
          subtitle="Live website sessions, traffic today, and the last seven days."
          eyebrow="Realtime"
          icon="pulse"
        >
          <View className="flex-row flex-wrap gap-2">
            <HeaderMetric label="Active now" value={String(data.realtime?.count ?? 0)} icon="radio" />
            <HeaderMetric label="Today" value={String(data.today?.visitors ?? 0)} icon="people" />
          </View>
        </ScreenHeader>

        {visitors.error ? <ErrorBanner message={visitors.error} /> : null}

        <View className="gap-4 p-4">
          <View className="gap-4">
            <View className="flex-row gap-4">
              <KPICard title="Active Right Now" value={String(data.realtime?.count ?? 0)} icon="radio-outline" color={colors.svGreen} />
              <KPICard title="Page Views Today" value={String(data.today?.pageViews ?? 0)} icon="document-text-outline" color={colors.svBrand} />
            </View>
            <View className="flex-row gap-4">
              <KPICard title="Visitors Today" value={String(data.today?.visitors ?? 0)} icon="person-outline" color={colors.svWarning} />
              <KPICard title="Last 30 Days" value={String(data.month?.visitors ?? 0)} icon="calendar-outline" color={colors.svOlive} />
            </View>
          </View>

          <SectionCard title="Visitors - last 7 days" subtitle="Daily visitor count" icon="stats-chart-outline">
            <WeeklyVisitorChart data={data.week?.visitors ?? []} />
          </SectionCard>

          <SectionCard
            title={`Active visitors (${data.realtime?.count ?? 0})`}
            subtitle="Auto-refreshes every 15 seconds"
            icon="radio-outline"
          >
            {activeVisitors.length === 0 ? (
              <CompactEmpty />
            ) : (
              <View className="gap-3">
                {activeVisitors.map((visitor) => (
                  <VisitorCard key={visitor.id} visitor={visitor} />
                ))}
              </View>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function WeeklyVisitorChart({ data }: { data: VisitorWeekEntry[] }) {
  if (data.length === 0) {
    return <EmptyState icon="bar-chart-outline" title="No visitor data" message="Visitor trends will appear after sessions are recorded." />;
  }

  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <View className="h-56 flex-row items-end gap-2 rounded-lg bg-svSoft px-2 pb-2 pt-4">
      {data.map((item) => {
        const height = Math.max(8, (item.count / max) * 160);
        return (
          <View key={item.date} className="flex-1 items-center justify-end">
            <Text className="mb-1 text-[10px] font-extrabold text-slate-500" numberOfLines={1}>
              {item.count}
            </Text>
            <View className="w-full rounded-t-lg bg-svBrand" style={{ height: height as DimensionValue }} />
            <Text className="mt-2 text-[10px] font-bold text-slate-500" numberOfLines={1}>
              {compactDateLabel(item.date)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function VisitorCard({ visitor }: { visitor: RealtimeVisitor }) {
  const currentPage = getCurrentPage(visitor);
  const latestEvent = visitor.events[0];
  const source = visitor.referrer?.trim() || "Direct / unknown";

  return (
    <View className="rounded-lg border border-svLine bg-svSoft p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-lg bg-emerald-50">
          <Ionicons name="ellipse" size={13} color={colors.svGreen} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-extrabold text-svDark" numberOfLines={1}>
                {currentPage}
              </Text>
              <Text className="mt-0.5 text-xs font-bold uppercase text-slate-400" numberOfLines={1}>
                {deviceLabel(visitor.screenWidth)} / {formatElapsedSince(visitor.lastActiveAt)} ago
              </Text>
            </View>
            <VisitorPill>{formatDuration(visitor.totalDuration)}</VisitorPill>
          </View>

          <View className="mt-3 gap-1.5">
            <IconLine icon="eye-outline" text={`${visitor.pageViews} page view${visitor.pageViews === 1 ? "" : "s"}`} />
            <IconLine icon="link-outline" text={source} />
            <IconLine icon="time-outline" text={`Started ${formatDateTime(visitor.createdAt)}`} />
            {latestEvent ? <IconLine icon="flash-outline" text={eventLabel(latestEvent)} /> : null}
          </View>

          <View className="mt-3 border-t border-slate-200 pt-2">
            <InfoRow label="Session ID" value={visitor.sessionId} mono />
          </View>
        </View>
      </View>
    </View>
  );
}

function VisitorPill({ children }: { children: ReactNode }) {
  return (
    <View className="rounded-lg bg-white px-2.5 py-1">
      <Text className="text-xs font-extrabold text-svBrandStrong">{children}</Text>
    </View>
  );
}

function IconLine({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text className="flex-1 text-sm font-bold text-slate-600" numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

function CompactEmpty() {
  return (
    <View className="items-center rounded-lg bg-svSoft px-4 py-8">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-white">
        <Ionicons name="people-outline" size={24} color={colors.svBrand} />
      </View>
      <Text className="mt-3 text-base font-extrabold text-svDark">No active visitors</Text>
      <Text className="mt-1 text-center text-sm text-slate-500">Live sessions will appear here when someone is browsing the website.</Text>
    </View>
  );
}

function getCurrentPage(visitor: RealtimeVisitor): string {
  const pageEvent = visitor.events.find((event) => Boolean(event.page));
  return pageEvent?.page ?? visitor.landingPage ?? "/";
}

function eventLabel(event: VisitorEvent): string {
  const type = event.type.replace(/_/g, " ");
  const page = event.page ? ` on ${event.page}` : "";
  const element = event.element ? ` - ${event.element}` : "";
  return `${type}${page}${element}`;
}

function deviceLabel(width: number | null | undefined): string {
  if (!width) return "Unknown device";
  if (width < 640) return "Mobile";
  if (width < 1024) return "Tablet";
  return "Desktop";
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.max(0, seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatElapsedSince(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  return formatDuration(seconds);
}
