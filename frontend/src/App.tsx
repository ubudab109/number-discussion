import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TreeView } from './components/CalculationTree/TreeView';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Modal } from './components/Modal';

const AppContent: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
    };

    const handleRegisterSuccess = () => {
        setShowRegisterModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Number Discussion</h1>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-700">
                                    Welcome, <span className="font-semibold">{user?.username}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setShowRegisterModal(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <TreeView />
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
                <p>Number Discussion - Communicate through calculations</p>
            </footer>

            {/* Login Modal */}
            <Modal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Login to Your Account"
            >
                <LoginForm onSuccess={handleLoginSuccess} />
                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={() => {
                            setShowLoginModal(false);
                            setShowRegisterModal(true);
                        }}
                        className="text-green-600 hover:underline font-medium"
                    >
                        Register here
                    </button>
                </p>
            </Modal>

            {/* Register Modal */}
            <Modal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                title="Create New Account"
            >
                <RegisterForm onSuccess={handleRegisterSuccess} />
                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => {
                            setShowRegisterModal(false);
                            setShowLoginModal(true);
                        }}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Login here
                    </button>
                </p>
            </Modal>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
