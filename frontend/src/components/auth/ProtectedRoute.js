import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        console.log('ProtectedRoute - Token present:', !!token);
        if (!token) {
            console.log('ProtectedRoute - No token found, redirecting to login');
            navigate('/login', { replace: true });
        } else {
            console.log('ProtectedRoute - Token found, rendering protected content');
        }
    }, [token, navigate]);

    if (!token) {
        return null; // Return null while redirecting
    }

    return children;
};

export default ProtectedRoute; 