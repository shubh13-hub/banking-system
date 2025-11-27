import React, { useState } from 'react';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import BankerDashboard from './components/BankerDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === 'customer' ? (
        <CustomerDashboard user={user} onLogout={handleLogout} />
      ) : (
        <BankerDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
