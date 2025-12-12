export default function AdminPedidosNewPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Crear Pedido</h1>
      <p className="text-gray-600">
        Los pedidos solo pueden generarse automáticamente desde el sitio del cliente.<br />
        No es posible crear pedidos manualmente desde el panel admin.
      </p>
    </div>
  );
}
