import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import MinhaConta from './pages/MinhaConta';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <Categorias />
            </PrivateRoute>
          }
        />
        <Route
          path="/minha-conta"
          element={
            <PrivateRoute>
              <MinhaConta />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;