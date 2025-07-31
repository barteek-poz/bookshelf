import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.js";
import AuthContextProvider from "./context/AuthContext.js";
import { ErrorProvider } from "./context/ErrorContext.js";
import "./index.css";
import AddBook from "./pages/AddBook/AddBook.js";
import AdminPage from "./pages/AdminPage/AdminPage.js";
import BookPage from "./pages/BookPage/BookPage.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import EditBook from "./pages/EditBook/EditBook.js";
import ErrorPage from "./pages/ErrorPage/ErrorPage.js";
import Login from "./pages/Login/Login.js";
import MainLayout from "./pages/MainLayout/MainLayout.js";
import SearchPage from "./pages/SearchPage/SearchPage.js";
import Signup from "./pages/Signup/Signup.js";
import AdminRoute from "./components/AdminRoute/AdminRoute.js";

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
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminPage/>
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "error",
        element: (
          <ProtectedRoute>
            <ErrorPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

const rootContainer = document.getElementById("root")
if(!rootContainer) {
  throw new Error('Root container is missing in index.html')
}
const root = createRoot(rootContainer);

root.render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorProvider>
      <RouterProvider router={router} />
      </ErrorProvider>
    </AuthContextProvider>
  </StrictMode>
);
