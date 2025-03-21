import { Routes, Route, useLocation, useNavigate } from 'react-router';

import LoginPage from './app/login/page';
import MainPage from './app/main/page';
import { useSelector } from 'react-redux'
import { RootState } from './redux';
import { useEffect } from 'react';
import { PUBLIC_ROUTES } from './Const';
import { DropdownMenu } from './components/ui/dropdown-menu';
import MobileMenu from './components/ui/mobile-menu';

// import { MobileMenu} from "./components/ui/mobile-menu";


const AppRoutes = () => {

  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Loading:", user.isLoading, "Auth:", user.isAuthenticated);

    if (user.isLoading) return;

    if (!user.isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user.isAuthenticated, user.isLoading, location.pathname]);

  if (!user.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes >
    )
  }

  return (
    <>
      <Routes>
        <Route index path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <DropdownMenu></DropdownMenu>

      <MobileMenu></MobileMenu>
    </>
  );
};

export default AppRoutes;