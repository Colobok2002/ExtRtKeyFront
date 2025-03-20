// src/components/Routes.tsx
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router';

//Components
import LoginPage from './app/login/page';
import MainPage from './app/main/page';
import { useSelector } from 'react-redux'
import { RootState } from './redux';
import { useEffect } from 'react';



const AppRoutes = () => {

  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const navigate = useNavigate();

  // INFO в будущем пути для временного доступа
  const publicRoutes = ['/test_page']

  useEffect(() => {
    if (!user.isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user.isAuthenticated, location.pathname]);

  if (!user.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes >
    )
  }

  return (
    <Routes>
      <Route index path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;