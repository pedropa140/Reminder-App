import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ContactPage_nonSignedIn from './components/ContactPage_nonSignedIn';
import UserPage from './components/UserPage';
import LoggedOutPage from './components/LoggedOutPage';
import PomodoroTimer from './components/PomodoroTimer';
import ContactPage_SignedIn from './components/ContactPage_SignedIn';
import ProtectedRoute from './components/ProtectedRoute';
import GoalPage from './components/Goal';
import PairPage from './components/Pair';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/contact" element={<ContactPage_nonSignedIn />} />
        <Route path="/logged-out" element={<LoggedOutPage />} />
        <Route path="/pair" element={<PairPage />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/pomodoro"
          element={
            <ProtectedRoute>
              <PomodoroTimer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/contact"
          element={
            <ProtectedRoute>
              <ContactPage_SignedIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/goal"
          element={
            <ProtectedRoute>
              <GoalPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
