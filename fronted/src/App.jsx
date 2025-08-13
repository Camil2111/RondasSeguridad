import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RondaNueva from './pages/RondaNueva';
import './styles/index.css';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function PrivateRoute({ element }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return element;
}

export default function App() {
  const router = createBrowserRouter([
    { path: '/', element: <PrivateRoute element={<Dashboard />} /> },
    { path: '/ronda', element: <PrivateRoute element={<RondaNueva />} /> },
    { path: '/login', element: isLoggedIn() ? <Navigate to="/" replace /> : <Login /> }
  ]);
  return <RouterProvider router={router} />
}
