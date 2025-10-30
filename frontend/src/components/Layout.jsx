import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { analyticsAPI } from '@services/api';
import { authAPI } from '@services/api';
import { useAuthStore } from '@store/authStore';

export default function Layout() {
  const location = useLocation();
  const { user, token, setAuth, updateUser } = useAuthStore();

  useEffect(() => {
    analyticsAPI.track({
      type: 'pageview',
      path: location.pathname + location.search,
      referrer: document.referrer || undefined,
    });
  }, [location.pathname, location.search]);

  // Refresh user on app load if token exists, or fill missing flags like isAdmin
  useEffect(() => {
    if (token && (!user || user.isAdmin === undefined)) {
      authAPI.getMe()
        .then(res => {
          if (user) updateUser(res.data);
          else setAuth(res.data, token);
        })
        .catch(() => {});
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}





