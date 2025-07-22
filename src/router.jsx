
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
import TeacherRegister from "./pages/Dashboard/TeacherRegister";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgetPassword";
import Exam from "./pages/Dashboard/Exam";
import ExamCreate from "./pages/Dashboard/ExamCreate";
import ExamAttempt from "./pages/Dashboard/ExamAttempt";


const 
routesConfig = [ 
  {
    element: <AuthLayout />,
    children: [
    {
    path: "/",
    element: <Login />,
    },
    {
        path: "reset-password/:uid/:token",
        element: <ResetPassword />,
    },
    { path: "/forgot-password",
       element: <ForgotPassword />
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
        path: "teachers/register",
        element: <TeacherRegister />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "teachers",
        element: <Teachers />,
      },
      {
        path:"exams",
        element:<Exam />
      },
      {
        path:"exams/create",
        element:<ExamCreate/>
      },
       {
        path:"/exams/attempt/:examId",
        element:<ExamAttempt/>
      },
    ],
  },
];

export default function Routes() {
  const element = useRoutes(routesConfig);
  return element;
}
