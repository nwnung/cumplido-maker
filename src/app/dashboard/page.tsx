import { getUser } from '@/utils/supabase/server';

export default async function DashboardPage() {
  // Ya no necesitas verificar - middleware se encarga
  const user = await getUser(); // user SIEMPRE existe aquí
  
  return (
    <div>
      <h1>Dashboard de {user!.email}</h1>
      {/* Tu contenido */}
    </div>
  );
}