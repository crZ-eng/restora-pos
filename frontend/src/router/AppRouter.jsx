
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/admin/Dashboard";
import Productos from "../pages/admin/productos/Productos";
import Meseros from "../pages/admin/Meseros";

import Mesero from "../pages/waiter/Mesero";


function RutaProtegida({ children, rol }) {

    const token = localStorage.getItem("access_token");
    const usuarioRol = localStorage.getItem("rol");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (rol && usuarioRol !== rol) {
        return <Navigate to="/" replace />;
    }

    return children;
}


export default function AppRouter() {

    return (

        <Routes>

            {/* LOGIN */}

            <Route
                path="/"
                element={<Login />}
            />


            {/* REGISTRO ADMINISTRADOR */}

            <Route
                path="/registro"
                element={<Register />}
            />


            {/* ADMINISTRADOR */}

            <Route
                element={
                    <RutaProtegida rol="administrador">
                        <AdminLayout />
                    </RutaProtegida>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/productos"
                    element={<Productos />}
                />

                <Route
                    path="/meseros"
                    element={<Meseros />}
                />

            </Route>


            {/* MESERO */}

            <Route
                path="/mesero"
                element={
                    <RutaProtegida rol="mesero">
                        <Mesero />
                    </RutaProtegida>
                }
            />


            {/* CUALQUIER RUTA DESCONOCIDA */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );

}
