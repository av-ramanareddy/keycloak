import React from 'react';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your secure dashboard
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure Single Sign-On</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Protected User Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Keycloak Integration</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In with Keycloak</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Powered by Keycloak • Secure Authentication
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo Application with SSO Integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;