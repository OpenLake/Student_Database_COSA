import { Route, Navigate } from 'react-router-dom';
import AddUser from '../src/AddUser';

function PrivateRoute({ element, isLoggedIn, fallbackPath }) {
  return isLoggedIn ? (
    <Route element={AddUser} />
  ) : (
    <Navigate to='/' />
  );
}

export default PrivateRoute;