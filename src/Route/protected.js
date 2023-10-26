import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const auth = localStorage.getItem('user');
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    //Using an Outlet component allows us to create a flexible, reusable component hierarchy that can handle dynamic content based on the current URL path.
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
