import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AnimatedOutlet from "./layouts/AnimatedOutlet";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import PostPage from "./pages/PostPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import TitleDetailsPage from "./pages/TitleDetailsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminRoute from "./components/auth/AdminRoute";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<MainLayout />}>
        <Route element={<AnimatedOutlet />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/title" element={<TitleDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
