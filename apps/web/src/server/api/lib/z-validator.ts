import { zValidator as baseZValidator } from "@hono/zod-validator";

export const zValidator = ((target: unknown, schema: unknown, hook?: unknown) =>
  baseZValidator(
    target as Parameters<typeof baseZValidator>[0],
    schema as Parameters<typeof baseZValidator>[1],
    hook as Parameters<typeof baseZValidator>[2],
  )) as typeof baseZValidator;
