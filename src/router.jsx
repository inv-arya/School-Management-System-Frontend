

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
import Chat from "./pages/Dashboard/chat";
import ChatApproval from "./pages/ChatApproval";
import TeacherAssigment from "./pages/Dashboard/TeacherAssigment";
import AssignmentCreate from "./pages/Dashboard/AssigmentCreate";
import AssignmentEdit from "./pages/Dashboard/AssignmentEdit";
import SubjectsListPage from "./pages/Dashboard/SubjectList";
import AssignmentsListPage from "./pages/Dashboard/AssignmentsListPage";
import AssignmentDetailPage from "./pages/Dashboard/AssignmentDetailPage";
import TeacherAssignmentDetailPage from "./pages/Dashboard/TeacherAssignmentDetailPage";



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
    path: "/chat/:action/:token",
    element: <ChatApproval />,
  },
  {
    path: "/chat/:action/:token",
    element: <ChatApproval />,
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
          <RoleBasedRoute allowedRoles={['admin','teacher']}>
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
        element: (<RoleBasedRoute allowedRoles={['admin','teacher','student']}>
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
        path:"/students/chat/:chatId",
        element: (<RoleBasedRoute allowedRoles={['student','teacher']}>
                  <Chat/>
                  </RoleBasedRoute>),
      },
      {
        path:"/teacher-assignments",
        element: (<RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherAssigment />
                  </RoleBasedRoute>),
      },
      {
        path:"/teacher-assignments/create",
        element: (<RoleBasedRoute allowedRoles={['teacher']}>
                  <AssignmentCreate />
                  </RoleBasedRoute>),
      },
      {
        path:"/teacher-assignments/edit/:id",
        element: (<RoleBasedRoute allowedRoles={['teacher']}>
                  <AssignmentEdit />
                  </RoleBasedRoute>),
      },
      {
        path:"/teacher-assignments/submissions/:id",
        element: (<RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherAssignmentDetailPage />
                  </RoleBasedRoute>),
      },
      {
        path:"/student-assignments",
        element: (<RoleBasedRoute allowedRoles={['student']}>
                  <SubjectsListPage />
                  </RoleBasedRoute>),
      },
      {
        path:"/student-assignments/:subject",
        element: (<RoleBasedRoute allowedRoles={['student']}>
                  <AssignmentsListPage />
                  </RoleBasedRoute>),
      },
      {
        path:"/student/assignment/:id",
        element: (<RoleBasedRoute allowedRoles={['student']}>
                  <AssignmentDetailPage />
                  </RoleBasedRoute>),
      },
    ],
  },
];

export default function Routes() {
  const element = useRoutes(routesConfig);
  return element;
}
