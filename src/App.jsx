import { useState } from 'react'

import './index.css'
import { Button } from "@material-tailwind/react";
import TransactionsTable from './components/Table';
import Layout from './layout';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ManageRequestDrivingTracking from "./components/Table";
import Passengers from "./pages/Passengers.jsx";
import Drivers from "./pages/Drivers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/request',
                element: <ManageRequestDrivingTracking />,
            },
            {
                path: '/passengers',
                element: <Passengers />,
            },
            {
                path: '/drivers',
                element: <Drivers />,
            },

            {
                path: '/dashboard',
                element: <Dashboard />,
            },
        ],
    },
]);
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <RouterProvider router={router} />


    </>
  )
}

export default App
