// src/routes.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import Login from "./pages/Login";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from './utils/PrivateRoute';
import Teachers from "./pages/Dashboard/Teachers";
import Students from "./pages/Dashboard/Students";
import Register from "./pages/Dashboard/Register";

const 
routesConfig = [ 
  {
    element: <AuthLayout />,
    children: [
    {
    path: "/",
    element: <Login />,
    },
    ],
  },
  {
    element: (
    <PrivateRoute>
      <AppLayout />
    </PrivateRoute>
  ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "students/register",
        element: <Register />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "teachers",
        element: <Teachers />,
      },
    ],
  },
];

export default function Routes() {
  const element = useRoutes(routesConfig);
  return element;
}
