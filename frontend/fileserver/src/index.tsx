import './index.css';
import App from './App';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

disableReactDevTools();

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

