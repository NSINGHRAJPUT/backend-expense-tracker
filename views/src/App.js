
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import SignUp from './components/Sign/SignUp';
import Expense from './components/expense/Expense';
import ForgotPassword from './components/Sign/ForgotPassword';
import ResetPassword from './components/Sign/ResetPassword';


const router = createBrowserRouter([
  { path: '/', element: <SignUp /> },
  { path: '/expense', element: <Expense /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/resetpassword/:uid', element: <ResetPassword /> }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
