export type EnquiryStatus = "new" | "quoted" | "accepted" | "declined";
export type StorageEnquiryStatus = "new" | "under_review" | "quoted" | "closed";

export type EnquiryListItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  fromAddress?: string;
  propertyType?: string;
  bedrooms?: number;
  toCountry: string;
  toCity: string;
  needsPacking?: boolean;
  needsStorage?: boolean;
  notes?: string | null;
  status: EnquiryStatus;
  quotedPrice?: number | null;
  adminNotes?: string | null;
  createdAt: string;
};

export type EnquiryDetail = Required<
  Pick<
    EnquiryListItem,
    | "id"
    | "customerName"
    | "customerEmail"
    | "customerPhone"
    | "fromAddress"
    | "propertyType"
    | "bedrooms"
    | "toCountry"
    | "toCity"
    | "needsPacking"
    | "needsStorage"
    | "status"
    | "createdAt"
  >
> & {
  notes?: string | null;
  quotedPrice?: number | null;
  adminNotes?: string | null;
};

export type StorageEnquiryListItem = {
  id: string;
  reference: string;
  status: StorageEnquiryStatus;
  firstName: string;
  lastName?: string | null;
  customerEmail: string;
  customerPhone: string;
  storageStartKind: string;
  storageStartDate?: string | null;
  storageDuration: string;
  estimatedUnitSize: string;
  needsCollectionTransport: boolean;
  collectionAddress?: string | null;
  collectionPostcode: string;
  collectionAccess?: Record<string, unknown> | null;
  storageFacilityKnown: boolean;
  storageFacility?: Record<string, unknown> | null;
  needsReturnTransport: boolean;
  returnDestinationKnown: boolean;
  returnAddress?: string | null;
  returnPostcode?: string | null;
  returnDateKind?: string | null;
  returnDate?: string | null;
  itemDescription: string;
  needsPacking: boolean;
  needsDismantling: boolean;
  notes?: string | null;
  quotedTransportPrice?: number | null;
  quotedStoragePrice?: number | null;
  quotePeriod?: string | null;
  quoteNotes?: string | null;
  adminNotes?: string | null;
  quoteSentAt?: string | null;
  quoteEmailStatus?: string | null;
  quoteEmailError?: string | null;
  notificationStatus?: string | null;
  notificationError?: string | null;
  createdAt: string;
};

export type StorageEnquiryDetail = StorageEnquiryListItem;
