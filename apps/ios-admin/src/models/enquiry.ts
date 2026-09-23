export type EnquiryStatus = "new" | "quoted" | "accepted" | "declined";

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
