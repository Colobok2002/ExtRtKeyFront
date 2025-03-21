/*
 * :mod:`mobile-menu` -- Навигационное меню
 * ===================================
 * .. moduleauthor:: ilya Barinov <i-barinov@it-serv.ru>
 */

import { Home, GaugeCircle, User, Component, History } from "lucide-react"; // Иконки
import { useNavigate } from "react-router";

const MobileMenu: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 w-full border-t shadow-md flex justify-between items-center px-4 py-2">
            <button onClick={() => navigate("/")} className="flex flex-col items-center text-gray-600 hover:text-black">
                <Component size={24} />
                <span className="text-xs">Устройства</span>
            </button>

            <button onClick={() => navigate("/search")} className="flex flex-col items-center text-gray-600 hover:text-black">
                <GaugeCircle size={24} />
                <span className="text-xs">Счетчики</span>
            </button>

            <button onClick={() => navigate("/")} className="relative -top-5 bg-[#7700ff] text-white p-3 rounded-full shadow-lg">
                <Home size={34} />
            </button>

            <button onClick={() => navigate("/history")} className="flex flex-col items-center text-gray-600 hover:text-black">
                <History size={24} />
                <span className="text-xs">История</span>
            </button>

            <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-gray-600 hover:text-black">
                <User size={24} />
                <span className="text-xs">Профиль</span>
            </button>
        </nav>
    );
};

export default MobileMenu;
