import React from 'react';
import ManageRequestDrivingTracking from './components/Table';
import {Sidebar} from './components/Sidebar';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Passengers from "./pages/Passengers.jsx";
import Drivers from "./pages/Drivers.jsx";



function Layout(props) {
    return (
        <div className='flex flex-row h-screen bg-[#F4F7FE] '>
            <Sidebar/>
            <Outlet />
        </div>
    );
}

export default Layout;