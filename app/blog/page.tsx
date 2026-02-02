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
} from "lucide-react";

const blogs = [
  {
    _id: "1",
    slug: "modern-agriculture-ai",
    title:
      "How AI is Transforming Modern Agriculture",
    excerpt:
      "Explore how artificial intelligence is reshaping farming through data-driven insights and smart automation.",
    coverImage:
      "https://images.unsplash.com/photo-1589927986089-35812386bbbf",
    category: "Agriculture",
    views: 1240,
    likes: 85,
    readingTime: 6,
    createdAt: "2025-01-20",
  },
  {
    _id: "2",
    slug: "iot-smart-farming",
    title: "IoT and the Future of Smart Farming",
    excerpt:
      "IoT sensors are enabling precision agriculture and better farm management decisions.",
    coverImage:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    category: "IoT",
    views: 940,
    likes: 67,
    readingTime: 5,
    createdAt: "2025-01-18",
  },
  {
    _id: "3",
    slug: "digital-marketplace-farmers",
    title:
      "Digital Marketplaces Empowering Farmers",
    excerpt:
      "Digital platforms help farmers connect directly with buyers, improving transparency and income.",
    coverImage:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
    category: "Marketplace",
    views: 780,
    likes: 42,
    readingTime: 4,
    createdAt: "2025-01-12",
  },
];

export default function BlogPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">
              Our Blog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6"
          >
            Insights & Stories from{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AgriLink
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-600"
          >
            Discover articles, tutorials, and
            innovations shaping digital
            agriculture.
          </motion.p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={`/blog/${blog.slug}`}
                className="group block h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between h-[calc(100%-13rem)]">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                        {blog.category}
                      </span>
                      <span className="text-gray-500">
                        {new Date(
                          blog.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {blog.likes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blog.readingTime} min
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Pagination / CTA */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-95 hover:shadow-lg transition-all"
          >
            Back to Home
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
