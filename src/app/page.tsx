import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Zap, Check } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-7000"></div>
        </div>

        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mb-6 leading-tight">
            Welcome to <span className="block">OrderApp</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            The ultimate solution for managing your orders and discovering amazing products. Experience seamless shopping with enterprise-grade security and lightning-fast performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transition-all transform hover:scale-105 shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 group"
            >
              <span>Sign In</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-700 font-bold text-lg transition-all transform hover:scale-105 shadow-card flex items-center justify-center gap-2 group"
            >
              <span>Create Account</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Browse Products */}
            <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover p-8 transition-all transform hover:-translate-y-2 duration-300 border border-gray-100 hover:border-blue-200">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse Products</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover a wide range of products across multiple categories. Find exactly what you're looking for with our intuitive search and filtering system.
              </p>
            </div>

            {/* Secure */}
            <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover p-8 transition-all transform hover:-translate-y-2 duration-300 border border-gray-100 hover:border-blue-200">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security. We use the latest encryption and security protocols to keep your information safe.
              </p>
            </div>

            {/* Fast */}
            <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover p-8 transition-all transform hover:-translate-y-2 duration-300 border border-gray-100 hover:border-blue-200">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience blazing-fast performance with optimized loading times. Our infrastructure ensures smooth user experience every time.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Manage Your Orders
              </h2>
              <ul className="space-y-4">
                {[
                  'Create and track orders easily',
                  'Get real-time order updates',
                  'Organize orders by category',
                  'Sort by price, name, or date',
                  'Beautiful and intuitive interface',
                  'Mobile-friendly responsive design',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white items-center shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-card">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Secure</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-card">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-green-100">Uptime</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-card">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-purple-100">Users</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-8 text-white shadow-card">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-orange-100">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-card-hover">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are managing their orders efficiently with OrderApp.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-card hover:shadow-card-hover"
          >
            Create Your Free Account →
          </Link>
        </div>
      </div>
    </main>
  );
}
