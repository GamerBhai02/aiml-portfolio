import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { firebaseReady } from './firebase';
import { useAuth } from './hooks/useAuth';
import SetupScreen from './components/SetupScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import usePageMeta from './hooks/usePageMeta';

function AdminGate() {
  const { user, loading } = useAuth();
  usePageMeta({ title: 'Admin — Portfolio', noindex: true });
  if (loading) return <Loading full />;
  return user ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  if (!firebaseReady) {
    return <SetupScreen />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin" element={<AdminGate />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
