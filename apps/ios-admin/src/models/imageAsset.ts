export type ImageAssetSource = "service" | "item" | "content";

export type ImageAsset = {
  id: string;
  source: ImageAssetSource;
  section: string;
  key: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  previewUrl: string | null;
  isDefault: boolean;
  updatedAt: string | null;
};

export type ImageAssetListResponse = {
  items: ImageAsset[];
};

export type ImageMutationResponse = {
  id: string;
  source: ImageAssetSource;
  imageUrl: string | null;
  previewUrl: string | null;
};
