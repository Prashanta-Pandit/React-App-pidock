import './App.css';
import Layout from './Components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn';
import Registration from './Components/Registration';
import ForgotPassword from './Components/ForgotPassword';
import Dashboard from './Components/Portal/PortalLayout';
import Signout from './Components/SignOut/Signout';
import UserDetails from './Components/Portal/UserDetails';
import UserNotSignedIn from './Components/Portal/UserNotSignedIn';
import EditUserDetails from './Components/Portal/EditUserDetails';
import SidebarNav from './Components/Portal/SideNavBar';
import Portal from './Components/Portal/PortalLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* Add navs */}
          <Route index element={<SignIn />} />
          <Route path="register" element={<Registration />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path='signout' element={<Signout />} />
          <Route path='usernotsignedin' element={<UserNotSignedIn />} />

          {/* Portal route */}
          <Route path='portal' element={<Portal />} >
            <Route path='sidenavbar' element={<SidebarNav/>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path='profile' element={<UserDetails />} />
            <Route path='edituserdetails' element={<EditUserDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}


