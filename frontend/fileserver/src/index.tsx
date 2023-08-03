import './index.css';
import App from './App';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

disableReactDevTools();

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root')
)
