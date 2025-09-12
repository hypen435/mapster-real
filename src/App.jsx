import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import ViewIssues from './pages/ViewIssues.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import LiveMap from './pages/LiveMap.jsx';
import { useAuth } from './state/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="app-root">
      <Navbar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
          <Route path="/issues" element={<PrivateRoute><ViewIssues /></PrivateRoute>} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


