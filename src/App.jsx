import './App.css'
import Layout from './Components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn'
import Registration from './Components/Registration';

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
             {/*Add navs*/}
             <Route index element={< SignIn />} />
             <Route path="register" element={<Registration />} />
          </Route>
        </Routes>
      </Router>

  )
}
