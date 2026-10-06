import "hono";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
    userRole: "ADMIN" | "DRIVER" | "CUSTOMER";
    userEmail: string;
  }
}
