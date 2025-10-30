import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Layout from '@components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
// import Leaderboard from '@/pages/Leaderboard';
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
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
        
        {/* PRICING & PAYMENT ROUTES DISABLED - Uncomment below to re-enable */}
        {/* <Route path="/pricing" element={<Pricing />} /> */}
        {/* <Route path="/payment/success" element={<PaymentSuccess />} /> */}
        {/* <Route path="/payment/cancel" element={<PaymentCancel />} /> */}
        
        <Route path="/game/:gameId" element={<GameRouter />} />
        <Route path="/admin/metrics" element={user ? <AdminMetrics /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;

