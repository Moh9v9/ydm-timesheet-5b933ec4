
import { createRoot } from 'react-dom/client';
import App from './App';  // Removed .tsx extension
import './index.css';

// Create root and render app - removed duplicate Toaster
createRoot(document.getElementById("root")!).render(
  <App />
);
