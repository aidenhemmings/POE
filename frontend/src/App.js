import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import api from './services/api';
axios.defaults.baseURL = 'https://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/csrf-token', { withCredentials: true });
      console.log('fetched csrf token:', response.data.csrfToken)
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null; 
    }
  };

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if(token) {
        console.log('csrf token is fetched successfully', token)
      }
      else
      {
        console.error('failed to fetch csrf token')
      }
    };
    getCsrfToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
      setMessage('Failed to get CSRF token');
      return;
    }

    // Reset message
    setMessage('');
    
    // Validate email format
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage('Password must be longer than 6 characters long');
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await axios.post(
        'https://localhost:5000/api/user/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          withCredentials: true
        }
      );
      setMessage('Login successful');
      setToken(response.data.token); // Store token (if applicable)
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        setMessage(`Error during login: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        // Req made but no res was received
        setMessage('Network error: No response from server. Please try again later.');
      } else {
        // Something else happened
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false); // Stop loading state
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Customer International Payments Portal</h1>

        {!token ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <div style={styles.welcome}>
            <h2 style={styles.welcomeMessage}>Welcome back!</h2>
            <p>You are logged in.</p>
            <button onClick={() => setToken(null)} style={styles.logoutButton}>Logout</button>
          </div>
        )}

        {message && (
          <p style={message.startsWith('Error') ? styles.errorMessage : styles.successMessage}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7fc',
    padding: '20px',
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2.5rem',
    color: '#0056b3',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#333',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    padding: '0.85rem',
    fontSize: '1.1rem',
    color: 'white',
    backgroundColor: '#0056b3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '0.85rem',
    fontSize: '1.1rem',
    color: 'white',
    backgroundColor: '#e63946',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontWeight: '500',
  },
  welcome: {
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: '1.75rem',
    color: '#0056b3',
    marginBottom: '1rem',
  },
  successMessage: {
    color: '#28a745',
    fontWeight: '500',
    marginTop: '1.5rem',
  },
  errorMessage: {
    color: '#e63946',
    fontWeight: '500',
    marginTop: '1.5rem',
  },
};

export default App;