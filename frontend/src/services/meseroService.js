import api from "./api";


export const getMeseros = () =>
    api.get("auth/meseros/");


export const crearMesero = (data) =>
    api.post("auth/meseros/crear/", data);


export const actualizarMesero = (id, data) =>
    api.put(`auth/meseros/${id}/`, data);


export const eliminarMesero = (id) =>
    api.delete(`auth/meseros/${id}/`);