import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Loader } from 'lucide-react';

const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader className="animate-spin text-purple-500" size={32} />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/discover" replace />;
    }

    return children;
};

export default PublicRoute;
