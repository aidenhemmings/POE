import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      // Redirect or show success message
    } catch (error) {
      setError(error.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;