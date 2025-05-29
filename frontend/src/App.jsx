import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripList from "./pages/TripList"; // create this later
import CreateTrip from './pages/CreateTrip'
import TripDetail from './components/TripDetail'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trips" element={
            <PrivateRoute>
              <TripList />
            </PrivateRoute>
          } />
          <Route path="/trips/new" element={
            <PrivateRoute>
              <CreateTrip />
            </PrivateRoute>
          } />
          <Route path="/trips/:id" element={
            <PrivateRoute>
              <TripDetail />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;