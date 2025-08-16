import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RondaNueva from './pages/RondaNueva';
import HistorialRondas from './pages/HistorialRondas';
import './styles/index.css';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function PrivateRoute({ element }) {
  return isLoggedIn() ? element : <Navigate to="/login" replace />;
}

export default function App() {
  const router = createBrowserRouter([
    { path: '/', element: <PrivateRoute element={<Dashboard />} /> },
    { path: '/ronda', element: <PrivateRoute element={<RondaNueva />} /> },
    { path: '/historial', element: <PrivateRoute element={<HistorialRondas />} /> },
    { path: '/login', element: isLoggedIn() ? <Navigate to="/" replace /> : <Login /> }
  ]);

  return <RouterProvider router={router} />;
}

