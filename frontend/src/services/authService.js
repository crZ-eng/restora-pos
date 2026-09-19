import api from "./api";


export const registrarAdministrador = (data) =>
    api.post("auth/registro/", data);


export const loginAdministrador = (data) =>
    api.post("auth/login/", data);


export const loginMesero = (data) =>
    api.post("auth/meseros/login/", data);


export const crearMesero = (data) =>
    api.post("auth/meseros/crear/", data);