import { createAdminBootstrapHandler } from "../../../../modules/identity/admin-authorizer";
import { serverAdmin } from "../../../../modules/identity/server-admin";

export const POST = createAdminBootstrapHandler(serverAdmin);
