import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import "./index.css";
import AddBook from "./pages/AddBook/AddBook.tsx";
import BookPage from "./pages/BookPage/BookPage.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import EditBook from "./pages/EditBook/EditBook.tsx";
import Login from "./pages/Login/Login.tsx";
import MainLayout from "./pages/MainLayout/MainLayout.tsx";
import SearchPage from "./pages/SearchPage/SearchPage.tsx";
import Signup from "./pages/Signup/Signup.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "books/:id",
        element: (
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "books/:id/edit",
        element: (
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "books/add",
        element: (
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "books/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
