import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Layout from '@components/Layout';
import Landing from '@/pages/Landing';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Achievements from '@/pages/Achievements';
import Leaderboard from '@/pages/Leaderboard';
// PRICING IMPORTS DISABLED - Uncomment when re-enabling payment features
// import Pricing from '@/pages/Pricing';
// import PaymentSuccess from '@/pages/PaymentSuccess';
// import PaymentCancel from '@/pages/PaymentCancel';
import GameRouter from '@/pages/GameRouter';
import AdminMetrics from '@/pages/AdminMetrics';

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      {/* Landing page - no layout, full custom design */}
      <Route path="/" element={user ? <Navigate to="/games" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/games" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/games" /> : <Register />} />

      {/* Authenticated routes with layout */}
      <Route element={<Layout />}>
        <Route path="/games" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/achievements" element={user ? <Achievements /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* PRICING & PAYMENT ROUTES DISABLED - Uncomment below to re-enable */}
        {/* <Route path="/pricing" element={<Pricing />} /> */}
        {/* <Route path="/payment/success" element={<PaymentSuccess />} /> */}
        {/* <Route path="/payment/cancel" element={<PaymentCancel />} /> */}

        <Route path="/game/:gameId" element={<GameRouter />} />
        <Route path="/admin/metrics" element={user ? <AdminMetrics /> : <Navigate to="/login" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

