
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Navigation from './components/Navigation';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EventsPage from './pages/EventsPage';
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const hideNavigationPaths = ['/login', '/register', '/landing', '/'];
  // Show sidebar if user is logged in OR if we are NOT on a hidden path
  // Wait, the logic in Navigation was: if (hidePaths.includes(path) && !user) return null;
  // This means: if I am on a hidden path AND I am NOT logged in -> HIDDEN.
  // Otherwise (on hidden path AND logged in, OR on non-hidden path) -> SHOWN.
  const showNetwork = !(hideNavigationPaths.includes(location.pathname) && !user);

  return (
    <div className={`min-h-screen bg-black text-white pb-16 md:pb-0 ${showNetwork ? 'md:pl-64' : ''}`}>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <ConversationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      <Navigation />
      <BottomNav />
    </div>
  );
}

export default App;

