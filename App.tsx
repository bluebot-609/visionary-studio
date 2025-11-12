
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';
import { AuthProvider } from './providers/auth-provider';
import Dashboard from './routes/dashboard';
import Landing from './routes/landing';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-surface text-white/70">
              Preparing your studio…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
