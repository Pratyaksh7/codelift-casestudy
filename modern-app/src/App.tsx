import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/shell/Shell';
import Analytics from './pages/Analytics/Analytics';
import Coupons from './pages/Coupons';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import UserDetail from './pages/UserDetail/UserDetail';
import Users from './pages/Users';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
