
import Navbar from '@/components/navbars/Navbar'
import { Outlet } from 'react-router-dom'

const LayoutUser = () => {
  return (
    <div>
        <Navbar/>
        <main className='pt-16'>
        <Outlet/>
        </main>
    </div>
  )
}

export default LayoutUser