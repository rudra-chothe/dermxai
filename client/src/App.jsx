import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import PageLoader from "./components/ui/PageLoader";

// Toggle between Firebase and Simple auth for testing
const USE_FIREBASE_AUTH = import.meta.env.VITE_USE_FIREBASE_AUTH !== "false";
const AuthProviderComponent = USE_FIREBASE_AUTH
  ? AuthProvider
  : SimpleAuthProvider;

// Log which auth provider is being used
console.log(
  `🔐 Using ${
    USE_FIREBASE_AUTH ? "Firebase" : "Simple"
  } authentication provider`
);

import Index from "./pages/Index";
import Diagnose from "./pages/Diagnose";
import Reports from "./pages/Reports";
import ClinicalInsights from "./pages/ClinicalInsights";
import DocumentInsights from "./pages/DocumentInsights";
import QAAssistant from "./pages/QAAssistant";
import UserProfile from "./pages/UserProfile";
import UserProfileEdit from "./pages/UserProfileEdit";
import About from "./pages/About";
import Features from "./pages/Features";
import Mission from "./pages/Mission";
import HowItWorks from "./pages/HowItWorks";
import SocialLoginTest from "./components/SocialLoginTest";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AuthTestPage from "./pages/AuthTestPage";
import Layout from "./components/Layout";
import MuiStyleLayout from "./components/MuiStyleLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App content wrapper that can access auth context
const AppContent = () => {
  const { loading } = USE_FIREBASE_AUTH ? useAuth() : { loading: false };

  if (loading) {
    return <PageLoader message="Initializing DermX-AI..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <Dashboard />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnose"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <Diagnose />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <Reports />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <ClinicalInsights />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <DocumentInsights />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/qa"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <QAAssistant />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <UserProfile />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <MuiStyleLayout>
                    <UserProfileEdit />
                  </MuiStyleLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PublicRoute>
                  <Layout>
                    <About />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/features"
              element={
                <PublicRoute>
                  <Layout>
                    <Features />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/mission"
              element={
                <PublicRoute>
                  <Layout>
                    <Mission />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <PublicRoute>
                  <Layout>
                    <HowItWorks />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/test-social-login"
              element={
                <PublicRoute>
                  <SocialLoginTest />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route path="/auth-test" element={<AuthTestPage />} />
            <Route
              path="*"
              element={
                <PublicRoute>
                  <Layout>
                    <NotFound />
                  </Layout>
                </PublicRoute>
              }
            />
          </Routes>
        </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProviderComponent>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProviderComponent>
  </QueryClientProvider>
);

// // Add to Tailwind config
// colors= {
//   dark: {
//     900: '#0f172a', // bg
//     800: '#1e293b', // cards
//     700: '#334155', // borders
//     100: '#f8fafc', // text
//   }
// }

export default App;
