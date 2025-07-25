

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
import ExamUpdate from "./pages/Dashboard/ExamUpdate";
import StudentEdit from "./pages/Dashboard/StudentEdit";
import TeacherEdit from "./pages/Dashboard/TeacherEdit";
import RoleBasedRoute from "./utils/RoleBasedRoute";



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
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <Register />
          </RoleBasedRoute>),
      },
      {
        path: "teachers/register",
        element:(<RoleBasedRoute allowedRoles={['admin']}>
                  <TeacherRegister />
                </RoleBasedRoute>),
      },
      {
        path: "students",
        element: (<RoleBasedRoute allowedRoles={['admin','teacher']}>
                  <Students />
                  </RoleBasedRoute>),
      },
      {
        path: "teachers",
        element: (<RoleBasedRoute allowedRoles={['admin']}>
          <Teachers />
          </RoleBasedRoute>),
      },
      {
        path:"exams",
        element: (<RoleBasedRoute allowedRoles={['student','teacher']}>
                  <Exam/>
                  </RoleBasedRoute>),
      },
      {
        path:"exams/create",
        element: (<RoleBasedRoute allowedRoles={['teacher']}>
                  <ExamCreate/>
                  </RoleBasedRoute>),
      },
      {
        path:"/exams/attempt/:examId",
        element: (<RoleBasedRoute allowedRoles={['student']}>
                  <ExamAttempt/>
                  </RoleBasedRoute>),
      },
      {
        path:"/exams/update/:examId",
        element: (<RoleBasedRoute allowedRoles={['student','teacher']}>
                  <ExamUpdate/>
                  </RoleBasedRoute>),
      },
      {
         path: '/students/edit/:id',
         element: (<RoleBasedRoute allowedRoles={['admin','teacher']}>
                  <StudentEdit />
                  </RoleBasedRoute>),
      },
      {
        path: '/teachers/edit/:id',
         element: (<RoleBasedRoute allowedRoles={['admin']}>
                    <TeacherEdit />
                  </RoleBasedRoute>),
      },
      {
        path:"exams/create",
        element:<ExamCreate/>
      },
      {
        path:"/exams/attempt/:examId",
        element:<ExamAttempt/>
      },
      {
        path:"/exams/update/:examId",
        element:<ExamUpdate/>
      },
    ],
  },
];

export default function Routes() {
  const element = useRoutes(routesConfig);
  return element;
}
