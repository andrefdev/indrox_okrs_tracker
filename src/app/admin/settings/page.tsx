export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
                <p className="text-default-500">Ajustes generales y administración global.</p>
            </div>
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-default-200">
                <p className="text-default-400">Contenido en desarrollo</p>
            </div>
        </div>
    );
}
