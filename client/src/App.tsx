import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Habits from "./pages/Habits";
import Reports from "./pages/Reports";
import MainLayout from "./layouts/MainLayout";
import ApolloProviderWrapper from "./lib/ApolloProviderWrapper";
import Settings from "./pages/Settings";

const LandingWrapper: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);
  return <Landing />;
};

const DashboardWrapper: React.FC = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return <div>Loading...</div>;
  return <Dashboard clerkId={user.id} />;
};

const ReportWrapper: React.FC = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return <div>Loading...</div>;
  return <Reports />;
};

const ProtectedLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <ApolloProviderWrapper>
    <MainLayout>
      {children || <Outlet />}
    </MainLayout>
  </ApolloProviderWrapper>
);
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingWrapper />} />
      <Route
        path="/sign-in"
        element={
          <SignedOut>
            <SignInPage />
          </SignedOut>
        }
      />
      <Route
        path="/sign-up"
        element={
          <SignedOut>
            <SignUpPage />
          </SignedOut>
        }
      />
      <Route
        element={
          <SignedIn>
            <ProtectedLayout />
          </SignedIn>
        }
      >
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/reports" element={<ReportWrapper />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
