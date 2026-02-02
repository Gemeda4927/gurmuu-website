"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Eye,
  Heart,
  Clock,
  ChevronRight,
  User,
  Calendar,
  Tag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
} from "lucide-react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBlogs } from "@/lib/hooks/useBlogs";
import { Blog } from "@/types/blog.types";

export default function BlogPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  
  // Use the blogs hook to fetch all blogs
  const { blogsQuery } = useBlogs();
  const { data: blogs = [], isLoading, error } = blogsQuery;

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push("/login");
  };

  // Handle register redirect
  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  // Filter only published blogs
  const publishedBlogs = blogs.filter((blog: Blog) => blog.status === "published");
  const featuredBlogs = publishedBlogs.filter((blog: Blog) => blog.isFeatured);
  const regularBlogs = publishedBlogs.filter((blog: Blog) => !blog.isFeatured);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <Header
          onLoginClick={handleLoginRedirect}
          onRegisterClick={handleRegisterRedirect}
          onDashboardClick={handleDashboard}
          onLogoutClick={handleLogout}
        />
        
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <Header
          onLoginClick={handleLoginRedirect}
          onRegisterClick={handleRegisterRedirect}
          onDashboardClick={handleDashboard}
          onLogoutClick={handleLogout}
        />
        
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">Error loading blogs</div>
              <p className="text-gray-600">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-95 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
      {/* Header Component */}
      <Header
        onLoginClick={handleLoginRedirect}
        onRegisterClick={handleRegisterRedirect}
        onDashboardClick={handleDashboard}
        onLogoutClick={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-purple-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-100 mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">
                  AgriLink Knowledge Hub
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Cultivating{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Knowledge
              </span>
              <br />
              <span className="text-4xl lg:text-6xl">Harvesting{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Innovation
              </span></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Dive into insightful articles, cutting-edge research, and transformative stories
              that are shaping the future of agriculture and technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-400"
                    />
                  ))}
                </div>
                <span>Join <span className="font-semibold text-gray-700">{publishedBlogs.length}</span> articles community</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span><span className="font-semibold text-gray-700">{featuredBlogs.length}</span> featured insights</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Featured Section */}
          {featuredBlogs.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      Featured Insights
                    </span>
                  </h2>
                  <p className="text-gray-600 mt-2">Must-read articles handpicked by our editors</p>
                </div>
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {featuredBlogs.slice(0, 2).map((blog: Blog, index: number) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                    onMouseEnter={() => setHoveredBlog(blog._id)}
                    onMouseLeave={() => setHoveredBlog(null)}
                  >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="block bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-80 overflow-hidden">
                        {blog.coverImage?.url ? (
                          <Image
                            src={blog.coverImage.url}
                            alt={blog.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                            <BookOpen className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-sm">
                            {blog.category}
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center gap-3 text-white/90 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="text-sm">{blog.author?.name || "AgriLink Team"}</span>
                            </div>
                            <div className="w-1 h-1 bg-white/50 rounded-full" />
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(blog.publishedAt || blog.createdAt || "").toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-white line-clamp-2 group-hover:text-blue-100 transition-colors">
                            {blog.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {blog.excerpt || "Discover groundbreaking insights in modern agriculture..."}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-gray-500">
                            <span className="flex items-center gap-2">
                              <Eye className="w-5 h-5" />
                              <span className="font-medium">{blog.views || 0}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              <span className="font-medium">5 min read</span>
                            </span>
                          </div>
                          
                          <motion.div
                            animate={{ x: hoveredBlog === blog._id ? 5 : 0 }}
                            className="flex items-center gap-2 text-blue-600 font-semibold"
                          >
                            Read Article
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Section */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Latest Articles
                  </span>
                </h2>
                <p className="text-gray-600 mt-2">Explore our complete collection of knowledge</p>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{regularBlogs.length}</span> articles available
              </div>
            </div>

            {publishedBlogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No articles yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We're preparing insightful content for you. Check back soon for groundbreaking articles!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedBlogs.map((blog: Blog, index: number) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                    onMouseEnter={() => setHoveredBlog(blog._id)}
                    onMouseLeave={() => setHoveredBlog(null)}
                  >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="block h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        {blog.coverImage?.url ? (
                          <Image
                            src={blog.coverImage.url}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-full text-xs">
                            {blog.category}
                          </span>
                        </div>
                        {blog.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full text-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="truncate">{blog.author?.name || "AgriLink Team"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(blog.publishedAt || blog.createdAt || "").toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt || "Explore this insightful article about agricultural innovation..."}
                        </p>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {blog.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              5 min
                            </span>
                          </div>
                          
                          <motion.div
                            animate={{ x: hoveredBlog === blog._id ? 3 : 0 }}
                            className="flex items-center gap-1 text-blue-600 font-semibold text-sm"
                          >
                            Read
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {/* CTA Section */}
            {publishedBlogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 text-center"
              >
                <div className="max-w-2xl mx-auto px-8 py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Want to contribute your insights?
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Join our community of writers and share your knowledge with thousands of readers.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                    >
                      Become a Contributor
                    </Link>
                    <Link
                      href="/"
                      className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}