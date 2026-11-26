import api from "./api";

// Create a new order (pedido) in the backend.
export const createPedido = (data) => api.post("pedidos/", data);
