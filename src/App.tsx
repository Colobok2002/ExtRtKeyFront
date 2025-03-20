import { useEffect } from 'react'
import { NetworkChecker } from './utils/NetworkChecker'
import { ModeToggle } from './components/mode-toggle'
import AppRoutes from './AppRoutes'

function App() {
  useEffect(() => {
    NetworkChecker()
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
