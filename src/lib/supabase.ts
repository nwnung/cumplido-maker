import {
  createClient as serverCreateClient,
  getUser,
} from "@/utils/supabase/server";
import { createClient as browserCreateClient } from "@/utils/supabase/client";
import { updateSession } from "@/utils/supabase/middleware";

// Re-exportar los clientes de Supabase para tener acceso centralizado desde @lib
export { serverCreateClient as createServerClient, getUser };
export { browserCreateClient as createBrowserClient };
export { updateSession };

// Helper para crear cliente según el entorno
export const createClient = () => {
  // En server components usar createServerClient, en client components usar createBrowserClient
  if (typeof window === "undefined") {
    // Server-side
    return serverCreateClient();
  } else {
    // Client-side
    return browserCreateClient();
  }
};
