import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/dashboard';
import UserDashboard from './pages/client/dashboard';
import NewAssignment from './pages/client/NewAssignment';
import AllAssignments from './pages/client/AllAssignments';
import PaymentHistory from './pages/client/PaymentHistory';
import Assignments from './pages/admin/Assignments';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/user-dashboard' element={<UserDashboard />} />
        <Route path='/new-assignment' element={<NewAssignment /> }/>
        <Route path='/assignments' element={<AllAssignments /> } />
        <Route path='/payment-history' element={<PaymentHistory />}/>
        <Route path='/get-assignments' element={<Assignments /> }/>
      </Routes>
    </Router>
  );
}

export default App;

