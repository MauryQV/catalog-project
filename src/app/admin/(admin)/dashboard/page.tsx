import WhatsappSettingsDialog from "../components/WhatsappSettingsDialog";

export default async function Main() {
  // Si está autenticado, muestra el dashboard del admin
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Panel Principal</h1>
      <p>Bienvenido al administrador del catálogo.</p>
      <div className="mt-4">
        <WhatsappSettingsDialog />
      </div>
    </div>
  );
}
