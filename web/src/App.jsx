import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";
import { CriarConta } from "./pages/CriarConta";
import { Dashboard } from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/criarconta" element={<CriarConta />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
