// src/components/Routes.tsx
import { Routes, Route } from 'react-router';

//Components
import LoginPage from './app/login/page';
import MainPage from './app/main/page';


const AppRoutes = () => {
  return (
    <Routes>
        <Route index path="/" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
