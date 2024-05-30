import './App.css'
import Layout from './Components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn'
import Registration from './Components/Registration';
import ForgotPassword from './Components/ForgotPassword';
import Dashboard from './Components/Portal/Dashbaord';
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
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path='/signout' element={<Signout />} />
          </Route>
        </Routes>
      </Router>

  )
}
