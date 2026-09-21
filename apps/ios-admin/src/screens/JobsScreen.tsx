import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { ActionButton, HeaderMetric, ModalHeader, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingView } from "@/components/LoadingView";
import { StatusBadge } from "@/components/StatusBadge";
import { useJobs } from "@/hooks/useJobs";
import type { JobListItem } from "@/models";
import { colors } from "@/theme/colors";
import { formatDate, formatMoney } from "@/utils/format";
import { jobStatusMeta } from "@/utils/status";

type BulkAction = "pause" | "resume" | null;

export function JobsScreen() {
  const jobs = useJobs();
  const [bulkAction, setBulkAction] = useState<BulkAction>(null);
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);

  if (jobs.isLoading && jobs.jobs.length === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Jobs"
        subtitle="Control the driver marketplace, public visibility, and pay settings."
        eyebrow="Dispatch"
        icon="briefcase"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Available" value={String(jobs.jobs.length)} icon="briefcase" />
          <HeaderMetric label="Public" value={String(jobs.jobs.filter((job) => job.isPublic).length)} icon="eye" />
        </View>
      </ScreenHeader>
      {jobs.error ? <ErrorBanner message={jobs.error} /> : null}
      <View className="flex-row gap-3 px-4 py-4">
        <View className="flex-1">
          <ActionButton label="Pause All" icon="pause-circle" tone="dark" onPress={() => setBulkAction("pause")} />
        </View>
        <View className="flex-1">
          <ActionButton label="Publish All" icon="radio" onPress={() => setBulkAction("resume")} />
        </View>
      </View>
      <FlatList
        data={jobs.jobs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={jobs.isLoading} onRefresh={() => void jobs.load()} />}
        contentContainerClassName={jobs.jobs.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="briefcase-outline" title="No available jobs" message="Available driver jobs will appear here." />}
        renderItem={({ item }) => (
          <JobRow job={item} onToggle={() => void jobs.toggleVisibility(item)} onPress={() => setSelectedJob(item)} />
        )}
      />
      <SetPayModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onSave={(amount, note) => {
          if (!selectedJob) return;
          setSelectedJob(null);
          void jobs.setDriverPay(selectedJob.id, amount, note);
        }}
      />
      <ConfirmDialog
        visible={bulkAction !== null}
        title={bulkAction === "pause" ? "Pause All Jobs" : "Publish All Jobs"}
        confirmLabel="Continue"
        onCancel={() => setBulkAction(null)}
        onConfirm={() => {
          const action = bulkAction;
          setBulkAction(null);
          if (action === "pause") void jobs.pauseAll();
          if (action === "resume") void jobs.resumeAll();
        }}
      />
    </ScreenShell>
  );
}

function JobRow({ job, onToggle, onPress }: { job: JobListItem; onToggle: () => void; onPress: () => void }) {
  const meta = jobStatusMeta(job.status);
  const date = job.booking.scheduledDate ?? job.booking.scheduledAt;
  const service = job.booking.serviceName ?? job.booking.serviceSlug ?? "Service";
  const driverPayNote = job.driverPayNote ?? job.driverPayNotes;

  return (
    <Pressable onPress={onPress} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
            <Ionicons name="briefcase-outline" size={21} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            <Text className="font-mono text-xs font-extrabold uppercase text-slate-500">{job.booking.reference}</Text>
            <Text className="mt-1 text-base font-extrabold text-svDark" numberOfLines={1}>{service}</Text>
          </View>
        </View>
        <StatusBadge label={meta.label} color={meta.color} />
      </View>
      <View className="mt-4 gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm font-bold text-slate-600">{formatDate(date)} - {job.booking.selectedTimeSlot ?? job.booking.timeSlot ?? "Time TBC"}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={15} color={colors.muted} />
          <Text className="flex-1 text-sm text-slate-500" numberOfLines={2}>{job.booking.pickupAddress}</Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View>
          <Text className="text-xs font-bold uppercase text-slate-400">Price / driver pay</Text>
          <Text className="mt-0.5 font-extrabold text-svDark">{formatMoney(job.booking.totalPrice)} | {job.driverPay ? formatMoney(job.driverPay) : "Set pay"}</Text>
        </View>
        <Pressable onPress={onToggle} className="flex-row items-center gap-1 rounded-lg bg-slate-100 px-3 py-2">
          <Ionicons name={job.isPublic ? "eye" : "eye-off"} size={15} color={job.isPublic ? colors.svGreen : colors.muted} />
          <Text className="font-extrabold" style={{ color: job.isPublic ? colors.svGreen : colors.muted }}>
            {job.isPublic ? "Visible" : "Hidden"}
          </Text>
        </Pressable>
      </View>
      {driverPayNote ? <Text className="mt-2 text-xs text-slate-500">{driverPayNote}</Text> : null}
    </Pressable>
  );
}

function SetPayModal({
  job,
  onClose,
  onSave
}: {
  job: JobListItem | null;
  onClose: () => void;
  onSave: (amount: number, note?: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const value = Number(amount);
  const canSave = Number.isFinite(value) && value >= 0 && amount.length > 0;

  return (
    <Modal visible={job !== null} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Set Driver Pay" subtitle={job?.booking.reference ?? "Driver pay"} onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Pay details" icon="cash-outline">
            <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" className="rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
            <TextInput value={note} onChangeText={setNote} placeholder="Optional note" placeholderTextColor="#94A3B8" multiline className="mt-3 min-h-24 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark" />
          </SectionCard>
          <ActionButton label="Save Pay" icon="save" disabled={!canSave} onPress={() => onSave(value, note.trim() || undefined)} />
        </ScrollView>
      </View>
    </Modal>
  );
}
