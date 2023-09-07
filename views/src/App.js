
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import SignUp from './components/Sign/SignUp';
import Expense from './components/expense/Expense';

const router = createBrowserRouter([
  { path: '/', element: <SignUp /> },
  { path: '/expense', element: <Expense /> }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
