import Link from 'next/link';
import { ArrowRight, Users, Shield, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">Gurmuu</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-700 mb-6">
            <Zap className="h-4 w-4 mr-2" />
            <span className="text-sm">Role-Based Access Control System</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Secure User Management with 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500"> Smart Roles</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Three-tier access control system with user, admin, and superadmin roles. 
            Built for modern applications requiring granular permissions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="#features" className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Three User Roles</h3>
            <p className="text-gray-400">
              User, Admin, and Superadmin with distinct permissions and access levels.
              Perfect for scalable applications.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Authentication</h3>
            <p className="text-gray-400">
              JWT-based authentication with role-based middleware protection.
              Your data stays secure and accessible only to authorized users.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Easy Integration</h3>
            <p className="text-gray-400">
              RESTful API ready to integrate with your frontend. 
              Built with Next.js, TypeScript, and modern technologies.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-linear-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-10 text-center border border-gray-700">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust Gurmuu for their user management needs.
            Sign up in seconds.
          </p>
          <Link href="/signup" className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg">
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">Gurmuu</span>
          </div>
          <p>© {new Date().getFullYear()} Gurmuu. All rights reserved.</p>
          <p className="mt-2 text-sm">Secure user management platform</p>
        </div>
      </footer>
    </div>
  );
}