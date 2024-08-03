import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../Pages/LoginAndRegister/Login/Login';
import Register from '../Pages/LoginAndRegister/Register/Register';
import Dashboard from '../Pages/Dashboard/Dashboard';
import ForgetPassword from '../Pages/LoginAndRegister/ForgetPassword/ForgetPassword';
import ResetPassword from '../Pages/LoginAndRegister/ForgetPassword/ResetPassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} index/>
        <Route path='/register' element={<Register />}/>
        <Route path='/forget-password' element={<ForgetPassword />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

