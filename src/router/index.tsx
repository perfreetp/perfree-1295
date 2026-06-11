import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import AdminLayout from "@/components/Layout/AdminLayout";
import Home from "@/pages/Home";
import Exhibition from "@/pages/Exhibition";
import CollectionDetail from "@/pages/CollectionDetail";
import ActivityCalendar from "@/pages/ActivityCalendar";
import Learning from "@/pages/Learning";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/admin/Dashboard";
import ContentManagement from "@/pages/admin/ContentManagement";
import ActivityManagement from "@/pages/admin/ActivityManagement";
import MessageReview from "@/pages/admin/MessageReview";
import DataExport from "@/pages/admin/DataExport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "exhibition", element: <Exhibition /> },
      { path: "exhibition/:id", element: <CollectionDetail /> },
      { path: "calendar", element: <ActivityCalendar /> },
      { path: "learning", element: <Learning /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "content", element: <ContentManagement /> },
      { path: "activities", element: <ActivityManagement /> },
      { path: "messages", element: <MessageReview /> },
      { path: "export", element: <DataExport /> },
    ],
  },
]);
