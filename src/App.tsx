import { useEffect } from 'react'
import { NetworkChecker } from './utils/NetworkChecker'
import { ModeToggle } from './components/mode-toggle'
import AppRoutes from './AppRoutes'
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux';
import { getToken } from './utils/TokenProcessing';
import { setUser } from './redux/store/userStore';
import ApiConnector from './utils/ApiConnector';
import { GOOD_STATUS, PUBLIC_ROUTES } from "@/Const"
import { useLocation, useNavigate } from 'react-router';
function App() {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    NetworkChecker()
    const userApi = new ApiConnector("auth")
    const token = getToken()

    if (token) {
      userApi.post("check-token", { "token": token }).then((response) => {
        if (response.status == GOOD_STATUS) {
          dispatch(setUser())
        } else {
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate("/login", { replace: true });
          }
        }
      })
    } else {
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    }
  }, [])

  return (
    <>
      <div className='absolute right-4 top-4'>
        <ModeToggle />
      </div>
      <AppRoutes />
    </>
  )
}

export default App
