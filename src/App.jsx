import './App.css'
import Layout from './Components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn'
import Registration from './Components/Registration';
import ForgotPassword from './Components/ForgotPassword';
import Portal from './Components/Portal/Portal';
import Signout from './Components/SignOut/Signout';

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
             {/*Add navs*/}
             <Route index element={< SignIn />} />
             <Route path="/register" element={<Registration />} />
             <Route path="/forgotPassword" element={<ForgotPassword />} />
             <Route path="/portal" element={<Portal />} />
             <Route path='/signout' element={<Signout />} />
          </Route>
        </Routes>
      </Router>

  )
}
