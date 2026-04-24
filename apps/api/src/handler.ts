import { handle } from "hono/vercel";
import app from "./app";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handle(app);
