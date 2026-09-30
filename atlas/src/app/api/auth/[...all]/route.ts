import { toNextJsHandler } from "better-auth/next-js";
import { serverAuth } from "../../../../modules/identity/server-auth";

const auth = serverAuth;

export const { GET, POST } = toNextJsHandler(auth);
