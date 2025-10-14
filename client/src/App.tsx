import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import ApolloProviderWrapper from './lib/ApolloProviderWrapper';

function Protected({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) return null; 

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function DashboardWrapper() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  return <Dashboard clerkId={user.id} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route
        element={
          <Protected>
            <ApolloProviderWrapper>
              <MainLayout>
                <Outlet />
              </MainLayout>
            </ApolloProviderWrapper>
          </Protected>
        }
      >
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
