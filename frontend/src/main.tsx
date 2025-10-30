import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Details from './pages/Details'
import Checkout from './pages/Checkout'
import Result from './pages/Result'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'experience/:id', element: <Details /> },
      { path: 'checkout/:id', element: <Checkout /> },
      { path: 'result', element: <Result /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
