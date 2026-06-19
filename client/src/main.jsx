import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Store/Store.jsx'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
  <AuthProvider>
  <Provider store={store}>
        <App/>
    </Provider>
    </AuthProvider>
    </BrowserRouter>
)

