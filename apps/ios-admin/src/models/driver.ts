export type VanSize = "SMALL" | "MEDIUM" | "LARGE" | "LUTON";

export type DriverUser = {
  name: string;
  email: string;
  phone?: string | null;
};

export type DriverListItem = {
  id: string;
  vanSize: VanSize;
  isActive: boolean;
  totalEarned?: number;
  unpaidEarnings?: number;
  user: DriverUser;
};

export type DriverEarnings = {
  total: number;
  thisMonth: number;
  unpaid: number;
  paid: number;
};

export type DriverPayConfig = {
  percentage: number;
  minimumPay: number;
};
