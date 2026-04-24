import type { IncomingMessage, ServerResponse } from "http";
import app from "./app";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers["host"] ?? "localhost";
  const url = `https://${host}${req.url ?? "/"}`;

  let body: Buffer | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  const request = new Request(url, {
    method: req.method ?? "GET",
    headers: req.headers as HeadersInit,
    body: body && body.length > 0 ? body : null,
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
