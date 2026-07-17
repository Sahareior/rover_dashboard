import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import RoverDashboard from './components/RoverDashboard/RoverDashboard.jsx';
import Settings from './components/Settings/Settings.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/rover-dashboard', element: <RoverDashboard /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);