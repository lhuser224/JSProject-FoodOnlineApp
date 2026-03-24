import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import History from './pages/History';
import SellerDashboard from './pages/SellerDashboard';
import { AppProvider } from './context/AppContext'; 
import { AuthProvider } from './context/AuthContext'; 
import AdminDashboard from './pages/AdminDashboard';
export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/history" element={<History />} />
            <Route path="/seller" element={<SellerDashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}