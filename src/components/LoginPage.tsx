import React from 'react';
import { LogIn, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();

  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      title: 'Secure Authentication',
      description: 'Enterprise-grade SSO with Keycloak integration'
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: 'Protected Access',
      description: 'Your tasks are secured and private to your account'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-purple-500" />,
      title: 'Seamless Experience',
      description: 'Single sign-on across all your applications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Secure task management with enterprise SSO</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your tasks securely</p>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {loading ? 'Initializing...' : 'Sign in with SSO'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Powered by Keycloak • Enterprise Security
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2024 TaskFlow. Secure by design.
          </p>
        </div>
      </div>
    </div>
  );
};