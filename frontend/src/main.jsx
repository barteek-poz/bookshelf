import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import BookPage from "./pages/BookPage/BookPage";
import MainLayout from "./pages/MainLayout/MainLayout";
import AddBook from "./pages/AddBook/AddBook";
import EditBook from "./pages/EditBook/EditBook";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Menu from "./components/Menu/Menu";
import SearchPage from "./pages/SearchPage/SearchPage";
import bookLoader from "./loaders/bookLoader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <Login /> },
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
        loader: bookLoader
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
