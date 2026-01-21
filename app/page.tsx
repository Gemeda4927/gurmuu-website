import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle, 
  Lock, 
  Settings, 
  Globe, 
  Sparkles, 
  ShieldCheck,
  BarChart,
  Cloud,
  Users as UsersIcon,
  Server,
  Code,
  Sparkle,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-md">
                  <Shield className="h-7 w-7 text-gradient-to-r from-blue-600 to-purple-600" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuthShield
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/features" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Docs
              </Link>
              <Link 
                href="/signup" 
                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span className="relative flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70"></div>
        <div className="container relative mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-6 shadow-sm">
              <Sparkle className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Enterprise-Grade Access Control</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Modern
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"> Role-Based </span>
              Access Control
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Build secure applications with our three-tier access control system. 
              Perfect for teams that need granular permissions without complexity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/signup" 
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center min-w-[200px]"
              >
                <span className="relative flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              
              <Link 
                href="#features" 
                className="group bg-white hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center min-w-[200px]"
              >
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">3K+</div>
                <div className="text-gray-600">Active Teams</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-pink-600">50K+</div>
                <div className="text-gray-600">Users Managed</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete solution for modern application security and user management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Three User Roles</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                User, Admin, and Superadmin with distinct permissions and access levels.
                Perfect for scalable applications of any size.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Granular permissions
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Role inheritance
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Custom roles support
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure Authentication</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                JWT-based authentication with role-based middleware protection.
                Your data stays secure and accessible only to authorized users.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Multi-factor auth
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Session management
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Audit logs
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-pink-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Easy Integration</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                RESTful API ready to integrate with your frontend. 
                Built with Next.js, TypeScript, and modern technologies.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  TypeScript support
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Webhooks
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  SDK libraries
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 md:p-16 text-center border border-gray-200 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Secure Your Application?</h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Join thousands of developers who trust AuthShield for their user management needs.
                Start building securely today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/signup" 
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
                >
                  <span className="relative flex items-center">
                    Create Free Account
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
                <Link 
                  href="/contact" 
                  className="group bg-white hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  Contact Sales
                </Link>
              </div>
              <p className="text-gray-500 text-sm mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-100 border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AuthShield
                </span>
              </div>
              <p className="text-gray-600">
                Enterprise-grade access control for modern applications
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-600 hover:text-blue-600 transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 md:mb-0">
                © {new Date().getFullYear()} AuthShield. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}