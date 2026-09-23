import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import { ActionButton, HeaderMetric, ModalHeader, ScreenHeader, ScreenShell, SearchField, SectionCard } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FilterChips, type FilterChipOption } from "@/components/FilterChips";
import { LoadingView } from "@/components/LoadingView";
import type { ImageAsset, ImageAssetListResponse, ImageAssetSource, ImageMutationResponse } from "@/models";
import { colors } from "@/theme/colors";
import { formatDateTime } from "@/utils/format";

type IconName = ComponentProps<typeof Ionicons>["name"];

const SOURCE_OPTIONS: FilterChipOption<ImageAssetSource>[] = [
  { label: "All", value: null },
  { label: "Services", value: "service" },
  { label: "Catalogue", value: "item" },
  { label: "CMS", value: "content" },
];

export function ImagesScreen() {
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [source, setSource] = useState<ImageAssetSource | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [replaceTarget, setReplaceTarget] = useState<ImageAsset | null>(null);
  const [replaceUrl, setReplaceUrl] = useState("");
  const [removeTarget, setRemoveTarget] = useState<ImageAsset | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get<ImageAssetListResponse>(endpoints.images({ source }));
      setAssets(response.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load project images");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [source]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assets;

    return assets.filter((asset) => {
      const haystack = `${asset.section} ${asset.key} ${asset.title} ${asset.subtitle} ${asset.imageUrl ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [assets, query]);

  const missingCount = assets.filter((asset) => asset.imageUrl === null).length;
  const uploadedCount = assets.filter((asset) => asset.imageUrl?.startsWith("data:image")).length;

  function applyMutation(asset: ImageAsset, mutation: ImageMutationResponse): void {
    setAssets((current) =>
      current.map((item) =>
        item.source === asset.source && item.id === asset.id
          ? { ...item, imageUrl: mutation.imageUrl, previewUrl: mutation.previewUrl, isDefault: false, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  async function updateImage(asset: ImageAsset, imageUrl: string | null): Promise<void> {
    setSavingId(`${asset.source}:${asset.id}`);
    setError("");
    setSuccess("");

    try {
      const mutation = await apiClient.patch<ImageMutationResponse>(endpoints.image(asset.source, asset.id), { imageUrl });
      applyMutation(asset, mutation);
      setSuccess(imageUrl ? "Image updated." : "Image removed.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    } finally {
      setSavingId(null);
    }
  }

  async function removeImage(asset: ImageAsset): Promise<void> {
    setSavingId(`${asset.source}:${asset.id}`);
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(endpoints.image(asset.source, asset.id));
      applyMutation(asset, { id: asset.id, source: asset.source, imageUrl: null, previewUrl: null });
      setSuccess("Image removed.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    } finally {
      setSavingId(null);
    }
  }

  async function uploadImage(asset: ImageAsset): Promise<void> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.82,
      base64: true,
    });

    if (result.canceled) return;

    const selected = result.assets[0];
    if (!selected?.base64) {
      setError("Could not read the selected image.");
      return;
    }

    const mimeType = selected.mimeType ?? "image/jpeg";
    await updateImage(asset, `data:${mimeType};base64,${selected.base64}`);
  }

  function openReplaceModal(asset: ImageAsset): void {
    setReplaceTarget(asset);
    setReplaceUrl(asset.imageUrl ?? "");
    setError("");
    setSuccess("");
  }

  if (isLoading && assets.length === 0) return <LoadingView label="Loading project images..." />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Images"
        subtitle="Remove, replace, or upload images used across project sections."
        eyebrow="Media"
        icon="images"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Visible" value={String(assets.length - missingCount)} icon="image" />
          <HeaderMetric label="Missing" value={String(missingCount)} icon="image-outline" />
          <HeaderMetric label="Uploads" value={String(uploadedCount)} icon="cloud-upload" />
        </View>
      </ScreenHeader>

      {error ? <ErrorBanner message={error} /> : null}
      {success ? (
        <View className="mx-4 mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          <Text className="text-sm font-extrabold text-emerald-700">{success}</Text>
        </View>
      ) : null}

      <View className="px-4 pt-4">
        <SearchField value={query} onChangeText={setQuery} placeholder="Search images" autoCapitalize="none" autoCorrect={false} />
      </View>
      <FilterChips options={SOURCE_OPTIONS} value={source} onChange={setSource} />

      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => `${item.source}:${item.id}`}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void load(true)} />}
        contentContainerClassName={filteredAssets.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="images-outline" title="No images found" message="Try another section filter or search term." />}
        renderItem={({ item }) => (
          <ImageAssetRow
            asset={item}
            isSaving={savingId === `${item.source}:${item.id}`}
            onReplace={() => openReplaceModal(item)}
            onUpload={() => void uploadImage(item)}
            onRemove={() => setRemoveTarget(item)}
          />
        )}
      />

      <ReplaceImageModal
        asset={replaceTarget}
        value={replaceUrl}
        isSaving={replaceTarget !== null && savingId === `${replaceTarget.source}:${replaceTarget.id}`}
        onChange={setReplaceUrl}
        onClose={() => setReplaceTarget(null)}
        onSave={() => {
          if (!replaceTarget) return;
          const value = replaceUrl.trim();
          if (!value) {
            setError("Enter an image URL or choose Remove.");
            return;
          }
          setReplaceTarget(null);
          void updateImage(replaceTarget, value);
        }}
      />

      <ConfirmDialog
        visible={removeTarget !== null}
        title="Remove Image"
        message="This will clear the image from this project section."
        confirmLabel="Remove"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          const asset = removeTarget;
          setRemoveTarget(null);
          if (asset) void removeImage(asset);
        }}
      />
    </ScreenShell>
  );
}

function ImageAssetRow({
  asset,
  isSaving,
  onReplace,
  onUpload,
  onRemove,
}: {
  asset: ImageAsset;
  isSaving: boolean;
  onReplace: () => void;
  onUpload: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="mb-3 rounded-lg border border-svLine bg-white p-3 shadow-sm">
      <View className="flex-row gap-3">
        <View className="h-20 w-24 overflow-hidden rounded-lg bg-slate-100">
          {asset.previewUrl ? (
            <Image source={{ uri: asset.previewUrl }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Ionicons name="image-outline" size={24} color={colors.muted} />
            </View>
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-base font-extrabold text-svDark" numberOfLines={1}>
                {asset.title}
              </Text>
              <Text className="mt-0.5 text-xs font-bold uppercase text-slate-400" numberOfLines={1}>
                {asset.section} / {asset.key}
              </Text>
            </View>
            <SourcePill source={asset.source} />
          </View>
          <Text className="mt-2 text-sm leading-5 text-slate-500" numberOfLines={2}>
            {asset.subtitle}
          </Text>
          <Text className="mt-2 font-mono text-[11px] text-slate-400" numberOfLines={1}>
            {asset.imageUrl ?? "No image set"}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <Text className="flex-1 text-xs font-bold text-slate-400" numberOfLines={1}>
          {asset.updatedAt ? `Updated ${formatDateTime(asset.updatedAt)}` : asset.isDefault ? "Default project image" : "Not yet updated"}
        </Text>
        <View className="flex-row gap-2">
          <IconAction icon="cloud-upload-outline" label="Upload" disabled={isSaving} onPress={onUpload} />
          <IconAction icon="swap-horizontal-outline" label="Replace" disabled={isSaving} onPress={onReplace} />
          <IconAction icon="trash-outline" label="Remove" destructive disabled={isSaving || asset.imageUrl === null} onPress={onRemove} />
        </View>
      </View>
    </View>
  );
}

function SourcePill({ source }: { source: ImageAssetSource }) {
  const label = source === "service" ? "Service" : source === "item" ? "Item" : "CMS";
  const icon = source === "service" ? "briefcase-outline" : source === "item" ? "cube-outline" : "document-text-outline";

  return (
    <View className="flex-row items-center gap-1 rounded-lg bg-svBrandSubtle px-2 py-1">
      <Ionicons name={icon} size={12} color={colors.svBrand} />
      <Text className="text-[11px] font-extrabold text-svBrandStrong">{label}</Text>
    </View>
  );
}

function IconAction({
  icon,
  label,
  destructive = false,
  disabled = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const color = disabled ? colors.muted : destructive ? colors.svRed : colors.svBrand;

  return (
    <Pressable disabled={disabled} onPress={onPress} className={disabled ? "items-center rounded-lg bg-slate-50 px-3 py-2 opacity-60" : "items-center rounded-lg bg-slate-50 px-3 py-2"}>
      <Ionicons name={icon} size={17} color={color} />
      <Text className="mt-1 text-[10px] font-extrabold" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ReplaceImageModal({
  asset,
  value,
  isSaving,
  onChange,
  onClose,
  onSave,
}: {
  asset: ImageAsset | null;
  value: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal visible={asset !== null} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Replace Image" subtitle={asset?.title ?? "Image URL"} onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Image URL" subtitle="Paste a hosted URL, data URL, or project-relative image path." icon="link-outline">
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="/images/services/man-and-van.jpg"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              className="min-h-32 rounded-lg border border-svLine bg-white px-4 py-4 text-svDark"
            />
          </SectionCard>
          <ActionButton label="Save Image" icon="save" disabled={isSaving || value.trim().length === 0} onPress={onSave} />
        </ScrollView>
      </View>
    </Modal>
  );
}
