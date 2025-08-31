import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AuthTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { currentUser, signup, login, logout, error } = useAuth();

  const handleSignup = async () => {
    setLoading(true);
    setMessage('');
    try {
      await signup(email, password, displayName);
      setMessage('✅ Signup successful!');
    } catch (err) {
      setMessage(`❌ Signup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await login(email, password);
      setMessage('✅ Login successful!');
    } catch (err) {
      setMessage(`❌ Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    try {
      await logout();
      setMessage('✅ Logout successful!');
    } catch (err) {
      setMessage(`❌ Logout failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Auth Test</h2>
      
      {currentUser ? (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">
            ✅ Logged in as: {currentUser.email}
          </p>
          <p className="text-sm text-green-600">
            UID: {currentUser.uid}
          </p>
          <p className="text-sm text-green-600">
            Display Name: {currentUser.displayName || 'Not set'}
          </p>
          <p className="text-sm text-green-600">
            Email Verified: {currentUser.emailVerified ? 'Yes' : 'No'}
          </p>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-gray-600">Not logged in</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleSignup} 
            disabled={loading || currentUser}
            className="flex-1"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
          
          <Button 
            onClick={handleLogin} 
            disabled={loading || currentUser}
            variant="outline"
            className="flex-1"
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </div>

        {currentUser && (
          <Button 
            onClick={handleLogout} 
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? 'Loading...' : 'Logout'}
          </Button>
        )}
      </div>

      {message && (
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-blue-800 text-sm">{message}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded">
          <p className="text-red-800 text-sm">Error: {error}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded text-xs">
        <h3 className="font-medium mb-2">Debug Info:</h3>
        <p>Firebase Config Loaded: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</p>
        <p>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p>
        <p>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}</p>
      </div>
    </div>
  );
};

export default AuthTest;