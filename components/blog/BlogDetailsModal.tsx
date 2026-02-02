"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Tag,
  Sparkles,
  Award,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Zap,
  Star,
  Globe,
  Coffee,
  PenTool,
  Layers,
  Crown,
  ThumbsUp,
  BookmarkCheck,
  Send,
  Download,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  BookText,
  CalendarDays,
  Users,
  Hash,
  MapPin,
  Lightbulb,
  Gem,
  Trophy,
  Sparkle,
} from "lucide-react";
import { Blog } from "@/lib/types/blog.types";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  blog?: Blog;
}

export default function BlogDetailsModal({ isOpen, onClose, blog }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setCopied(false);
    setLiked(false);
    setBookmarked(false);
  }, [blog]);

  if (!isOpen || !blog) return null;

  const blogUrl = `${window.location.origin}/blog/${blog.slug}`;
  const readTime = `${Math.ceil(blog.content.split(" ").length / 200)} min read`;
  const wordCount = blog.content.split(" ").length;
  const paragraphs = blog.content.split('\n').filter(p => p.trim());
  
  // Calculate engagement score (simulated)
  const engagementScore = Math.min(100, (blog.likes || 0) * 2 + (blog.views || 0) * 0.1);

  const copyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    toast.success("✨ Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: `Check out this amazing blog: ${blog.title}`,
        url: blogUrl,
      });
    } else {
      copyLink();
    }
  };

  return (
    <>
      {/* Animated Gradient Overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-50 backdrop-blur-xl animate-in fade-in duration-500"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, rgba(255, 255, 255, 0) 50%)',
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkle className="w-3 h-3 text-blue-400/40" />
          </div>
        ))}
      </div>

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 w-full max-w-6xl ${isExpanded ? 'h-[95vh]' : 'max-h-[90vh]'} overflow-y-auto rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 duration-500 ease-out border border-white/20 dark:border-gray-700/30`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(59, 130, 246, 0.15)',
          }}
        >
          {/* Glowing Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20" />
            </div>
            
            <div className="relative p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                  <BookText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    Blog Insights
                    <span className="text-sm font-normal opacity-90">| Premium View</span>
                  </h2>
                  <p className="text-sm opacity-90 flex items-center gap-2 mt-1">
                    <Gem className="w-3 h-3" />
                    Dive deep into the details
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    Engagement Score
                  </span>
                  <div className="w-48 bg-white/20 rounded-full h-2.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 shadow-lg"
                      style={{ width: `${engagementScore}%` }}
                    />
                  </div>
                  <span className="font-bold">{engagementScore}/100</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    Quality: Premium
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Cover */}
          <div className="relative h-96 overflow-hidden group">
            {blog.coverImage?.url ? (
              <>
                <img 
                  src={blog.coverImage.url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={blog.title}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Cover Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-gradient-to-r from-black/70 to-transparent backdrop-blur-sm rounded-2xl p-6 max-w-2xl">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                      {blog.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-3 text-white/90">
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Featured Post
                      </span>
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trending
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No cover image</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="p-8 space-y-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Author</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{blog.author?.name ?? "Unknown"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-800/40 dark:to-cyan-800/40">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Published</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(blog.createdAt!).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/40 dark:to-orange-800/40">
                    <CalendarDays className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Read Time</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{readTime}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/40 dark:to-emerald-800/40">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Views</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {(blog.views ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/40 dark:to-pink-800/40">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags & Categories */}
            <div className="flex flex-wrap gap-3">
              {blog.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 hover:from-indigo-200 hover:to-purple-200"
                >
                  <Hash className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300">
                <Globe className="w-3 h-3" />
                {blog.category}
              </span>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  Article Content
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Coffee className="w-4 h-4" />
                  <span>{wordCount.toLocaleString()} words</span>
                  <span>•</span>
                  <span>{paragraphs.length} paragraphs</span>
                </div>
              </div>

              {/* Excerpt Card */}
              {blog.excerpt && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border border-blue-100 dark:border-blue-800/30">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-br-full" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">Key Insight</span>
                    </div>
                    <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-blue-500 pl-4">
                      {blog.excerpt}
                    </blockquote>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Gallery Section */}
              {blog.gallery?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" />
                    Gallery ({blog.gallery.length} images)
                  </h4>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                      src={blog.gallery[activeImage].url}
                      className="w-full h-96 object-cover transition-all duration-500 group-hover:scale-105"
                      alt={`Gallery ${activeImage + 1}`}
                    />
                    
                    {/* Navigation Controls */}
                    {blog.gallery.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImage((i) =>
                              i === 0 ? blog.gallery!.length - 1 : i - 1
                            )
                          }
                          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-300 hover:scale-110 hover:-translate-x-1"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                          onClick={() =>
                            setActiveImage((i) =>
                              i === blog.gallery!.length - 1 ? 0 : i + 1
                            )
                          }
                          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-300 hover:scale-110 hover:translate-x-1"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Thumbnails */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {blog.gallery.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === activeImage
                                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                                  : 'bg-white/60 hover:bg-white'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                          {activeImage + 1}/{blog.gallery.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                      liked
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
                    <span className="font-semibold">
                      {liked ? 'Liked' : 'Like'} • {(blog.likes || 0) + (liked ? 1 : 0)}
                    </span>
                    {liked && <ThumbsUp className="w-4 h-4 animate-bounce" />}
                  </button>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                      bookmarked
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30'
                    }`}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {bookmarked ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-semibold">Share</span>
                  </button>

                  <button
                    onClick={copyLink}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span className="font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(blogUrl, "_blank")}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Live
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Written with care
                </span>
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Premium Content
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Community Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add floating animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.7;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .slide-in-from-bottom-10 {
          animation: slideInFromBottom 0.5s ease-out;
        }
        
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}