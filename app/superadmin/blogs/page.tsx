"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useBlogs } from "@/lib/hooks/useBlogs";
import {
  Blog,
  CreateBlogDTO,
  UpdateBlogDTO,
} from "@/lib/types/blog.types";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Archive,
  Copy,
  ExternalLink,
  Grid3x3,
  List,
  Check,
  X,
  Star,
  RefreshCw,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  BookOpen,
  Heart,
  Share2,
  Bookmark,
  Filter as FilterIcon,
  SortAsc,
  Download,
  Upload,
  RotateCcw,
  AlertCircle,
  ArrowUpDown,
  LayoutGrid,
  FileText,
  Layers,
  Target,
  Award,
  Rocket,
  Shield,
  Globe,
  Hash,
  Users,
  MessageSquare,
  ThumbsUp,
  TrendingDown,
  PauseCircle,
  PlayCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DeleteConfirmationModal from "@/components/blog/DeleteConfirmationModal";
import BlogDetailsModal from "@/components/blog/BlogDetailsModal";
import CreateEditBlogModal from "@/components/blog/CreateEditBlogModal";

export default function BlogsPage() {
  const {
    blogsQuery,
    createBlog,
    updateBlog,
    softDeleteBlog,
    restoreBlog,
    hardDeleteBlog,
  } = useBlogs();

  // State management
  const [showCreateModal, setShowCreateModal] =
    useState(false);
  const [showEditModal, setShowEditModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [showDetailsModal, setShowDetailsModal] =
    useState(false);
  const [selectedBlog, setSelectedBlog] =
    useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [currentPage, setCurrentPage] =
    useState(1);
  const [statusFilter, setStatusFilter] =
    useState<
      "all" | "published" | "draft" | "archived"
    >("all");
  const [selectedRows, setSelectedRows] =
    useState<string[]>([]);
  const [deleteType, setDeleteType] = useState<
    "soft" | "hard"
  >("soft");
  const [viewMode, setViewMode] = useState<
    "grid" | "list"
  >("grid");
  const [sortBy, setSortBy] = useState<
    | "newest"
    | "oldest"
    | "title"
    | "popular"
    | "views"
  >("newest");
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [hoveredCard, setHoveredCard] = useState<
    string | null
  >(null);
  const [
    showAdvancedFilters,
    setShowAdvancedFilters,
  ] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  const itemsPerPage = 12;
  const searchInputRef =
    useRef<HTMLInputElement>(null);

  // Fetch all blogs including archived
  useEffect(() => {
    blogsQuery.refetch();
  }, []);

  // Handle create blog
  const handleCreateBlog = useCallback(
    async (data: CreateBlogDTO) => {
      console.log(
        "📤 Creating blog with data:",
        data
      );

      const loadingToast = toast.loading(
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse text-blue-500" />
          <span>
            Creating your masterpiece...
          </span>
        </div>
      );

      try {
        await createBlog.mutateAsync(data);
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>
              Blog created successfully!
            </span>
          </div>,
          { id: loadingToast, duration: 3000 }
        );
        setShowCreateModal(false);
      } catch (error: any) {
        console.error(
          "❌ Blog creation error:",
          error
        );
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create blog";

        toast.error(
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Error: {errorMessage}</span>
          </div>,
          { id: loadingToast, duration: 4000 }
        );
      }
    },
    [createBlog]
  );

  // Handle update blog
  const handleUpdateBlog = useCallback(
    async (data: UpdateBlogDTO) => {
      if (!selectedBlog) return;

      const loadingToast = toast.loading(
        <div className="flex items-center gap-2">
          <Edit className="w-4 h-4 animate-pulse text-yellow-500" />
          <span>Updating blog...</span>
        </div>
      );

      try {
        await updateBlog.mutateAsync({
          id: selectedBlog._id,
          data,
        });
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>
              Blog updated successfully!
            </span>
          </div>,
          { id: loadingToast }
        );
        setShowEditModal(false);
        setSelectedBlog(null);
      } catch (error: any) {
        toast.error(
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <span>
              Error:{" "}
              {error.message ||
                "Failed to update blog"}
            </span>
          </div>,
          { id: loadingToast }
        );
      }
    },
    [selectedBlog, updateBlog]
  );

  // Handle soft delete/archive
  const handleSoftDelete = useCallback(
    async (id: string) => {
      const loadingToast = toast.loading(
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 animate-pulse text-yellow-500" />
          <span>Archiving blog...</span>
        </div>
      );

      try {
        await softDeleteBlog.mutateAsync(id);
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>
              Blog archived successfully!
            </span>
          </div>,
          { id: loadingToast }
        );
        setShowDeleteModal(false);
        setSelectedBlog(null);
      } catch (error: any) {
        console.error(
          "Archive error:",
          error.response?.data
        );
        toast.error(
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <span>
              Error:{" "}
              {error.response?.data?.message ||
                error.message ||
                "Failed to archive blog"}
            </span>
          </div>,
          { id: loadingToast }
        );
      }
    },
    [softDeleteBlog]
  );

  // Handle restore
  const handleRestore = useCallback(
    async (id: string) => {
      const loadingToast = toast.loading(
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-pulse text-green-500" />
          <span>Restoring blog...</span>
        </div>
      );

      try {
        await restoreBlog.mutateAsync(id);
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>
              Blog restored successfully!
            </span>
          </div>,
          { id: loadingToast }
        );
      } catch (error: any) {
        toast.error(
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <span>
              Error:{" "}
              {error.message ||
                "Failed to restore blog"}
            </span>
          </div>,
          { id: loadingToast }
        );
      }
    },
    [restoreBlog]
  );

  // Handle hard delete
  const handleHardDelete = useCallback(
    async (id: string) => {
      const loadingToast = toast.loading(
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 animate-pulse text-red-500" />
          <span>
            Deleting blog permanently...
          </span>
        </div>
      );

      try {
        await hardDeleteBlog.mutateAsync(id);
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Blog deleted permanently!</span>
          </div>,
          { id: loadingToast }
        );
        setShowDeleteModal(false);
        setSelectedBlog(null);
      } catch (error: any) {
        toast.error(
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            <span>
              Error:{" "}
              {error.message ||
                "Failed to delete blog"}
            </span>
          </div>,
          { id: loadingToast }
        );
      }
    },
    [hardDeleteBlog]
  );

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (!selectedBlog) return;

    if (deleteType === "soft") {
      handleSoftDelete(selectedBlog._id);
    } else {
      handleHardDelete(selectedBlog._id);
    }
  }, [
    selectedBlog,
    deleteType,
    handleSoftDelete,
    handleHardDelete,
  ]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await blogsQuery.refetch();
    setTimeout(() => setIsRefreshing(false), 500);
    toast.success("Blogs refreshed!");
  };

  // Extract all unique categories
  const categories = useMemo(() => {
    const blogs = blogsQuery.data || [];
    const categorySet = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.category) {
        categorySet.add(blog.category);
      }
    });
    return ["all", ...Array.from(categorySet)];
  }, [blogsQuery.data]);

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    const blogs = blogsQuery.data || [];

    return blogs
      .filter((blog) => {
        // Search filter
        const matchesSearch =
          searchTerm === "" ||
          blog.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          blog.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          blog.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          blog.tags?.some((tag) =>
            tag
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );

        // Status filter
        let matchesStatus = true;
        if (statusFilter === "archived") {
          matchesStatus = blog.isDeleted === true;
        } else if (statusFilter === "all") {
          matchesStatus = true;
        } else {
          matchesStatus =
            blog.status === statusFilter &&
            blog.isDeleted !== true;
        }

        // Category filter
        const matchesCategory =
          selectedCategory === "all" ||
          blog.category === selectedCategory;

        // Date range filter
        const matchesDateRange = () => {
          if (!dateRange.start && !dateRange.end)
            return true;
          const blogDate = new Date(
            blog.createdAt || 0
          );
          const startDate = dateRange.start
            ? new Date(dateRange.start)
            : null;
          const endDate = dateRange.end
            ? new Date(
                dateRange.end + "T23:59:59"
              )
            : null;

          if (startDate && endDate) {
            return (
              blogDate >= startDate &&
              blogDate <= endDate
            );
          } else if (startDate) {
            return blogDate >= startDate;
          } else if (endDate) {
            return blogDate <= endDate;
          }
          return true;
        };

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory &&
          matchesDateRange()
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(
                b.createdAt || 0
              ).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          case "oldest":
            return (
              new Date(
                a.createdAt || 0
              ).getTime() -
              new Date(b.createdAt || 0).getTime()
            );
          case "title":
            return a.title.localeCompare(b.title);
          case "popular":
            // Sort by isFeatured first, then views, then likes
            if (a.isFeatured && !b.isFeatured)
              return -1;
            if (!a.isFeatured && b.isFeatured)
              return 1;
            return (
              (b.views || 0) +
              (b.likes || 0) -
              ((a.views || 0) + (a.likes || 0))
            );
          case "views":
            return (
              (b.views || 0) - (a.views || 0)
            );
          default:
            return 0;
        }
      });
  }, [
    blogsQuery.data,
    searchTerm,
    statusFilter,
    sortBy,
    selectedCategory,
    dateRange,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedBlogs.length / itemsPerPage
  );
  const startIndex =
    (currentPage - 1) * itemsPerPage;
  const paginatedBlogs =
    filteredAndSortedBlogs.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // Stats calculation
  const stats = useMemo(() => {
    const blogs = blogsQuery.data || [];
    return {
      total: blogs.length,
      published: blogs.filter(
        (b) =>
          b.status === "published" && !b.isDeleted
      ).length,
      draft: blogs.filter(
        (b) =>
          b.status === "draft" && !b.isDeleted
      ).length,
      archived: blogs.filter((b) => b.isDeleted)
        .length,
      featured: blogs.filter(
        (b) => b.isFeatured && !b.isDeleted
      ).length,
      categories: new Set(
        blogs.map((b) => b.category)
      ).size,
      totalViews: blogs.reduce(
        (sum, blog) => sum + (blog.views || 0),
        0
      ),
      totalLikes: blogs.reduce(
        (sum, blog) => sum + (blog.likes || 0),
        0
      ),
    };
  }, [blogsQuery.data]);

  // Format date
  const formatDate = useCallback(
    (dateString?: string) => {
      if (!dateString) return "N/A";
      return new Date(
        dateString
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    []
  );

  // Handle row selection
  const toggleRowSelection = useCallback(
    (id: string) => {
      setSelectedRows((prev) =>
        prev.includes(id)
          ? prev.filter((rowId) => rowId !== id)
          : [...prev, id]
      );
    },
    []
  );

  // Select all rows
  const selectAllRows = useCallback(() => {
    if (
      selectedRows.length ===
      paginatedBlogs.length
    ) {
      setSelectedRows([]);
    } else {
      setSelectedRows(
        paginatedBlogs.map((blog) => blog._id)
      );
    }
  }, [paginatedBlogs, selectedRows.length]);

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string, message?: string) => {
      navigator.clipboard.writeText(text);
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span>
            {message || "Copied to clipboard!"}
          </span>
        </div>
      );
    },
    []
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
    setSelectedCategory("all");
    setDateRange({ start: "", end: "" });
    setShowAdvancedFilters(false);
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    toast.success("Filters cleared!");
  }, []);

  // Quick toggle featured
  const toggleFeatured = useCallback(
    (blog: Blog) => {
      updateBlog.mutate(
        {
          id: blog._id,
          data: { isFeatured: !blog.isFeatured },
        },
        {
          onSuccess: () => {
            toast.success(
              blog.isFeatured
                ? "Removed from featured"
                : "Added to featured"
            );
          },
        }
      );
    },
    [updateBlog]
  );

  // Quick toggle status
  const toggleStatus = useCallback(
    (blog: Blog) => {
      updateBlog.mutate(
        {
          id: blog._id,
          data: {
            status:
              blog.status === "published"
                ? "draft"
                : "published",
          },
        },
        {
          onSuccess: () => {
            toast.success(
              blog.status === "published"
                ? "Moved to drafts"
                : "Published"
            );
          },
        }
      );
    },
    [updateBlog]
  );

  // Get status icon
  const getStatusIcon = useCallback(
    (status: string) => {
      switch (status) {
        case "published":
          return (
            <CheckCircle className="w-4 h-4 text-green-500" />
          );
        case "draft":
          return (
            <Clock className="w-4 h-4 text-yellow-500" />
          );
        case "archived":
          return (
            <Archive className="w-4 h-4 text-gray-500" />
          );
        default:
          return null;
      }
    },
    []
  );

  // Focus search on load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Loading state with beautiful skeleton
  if (blogsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Animated header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-48 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-32 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-10 animate-pulse"></div>
            </div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 p-5 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 animate-pulse"
                >
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (blogsQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/10 to-pink-50/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-red-200/30 p-8 shadow-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Oops! Failed to load blogs
              </h3>
              <p className="text-gray-600 mb-8">
                {blogsQuery.error?.message ||
                  "An unexpected error occurred"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    blogsQuery.refetch()
                  }
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Retry
                </button>
                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 border border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create First Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with glass morphism */}
          <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 p-6 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                      Blog Management
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Craft stories that inspire
                      and engage your audience
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5" />
                    {stats.total} Total Blogs
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {stats.published} Published
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm">
                    <Target className="w-3.5 h-3.5" />
                    {stats.featured} Featured
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    className={`p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 ${isRefreshing ? "animate-spin" : ""}`}
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <div className="flex items-center border border-gray-300/50 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner">
                    <button
                      onClick={() =>
                        setViewMode("list")
                      }
                      className={`p-2.5 transition-all duration-300 ${viewMode === "list" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setViewMode("grid")
                      }
                      className={`p-2.5 transition-all duration-300 ${viewMode === "grid" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="group relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2.5 font-semibold"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Blog
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats cards with glass morphism */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: "Total Blogs",
                value: stats.total,
                icon: FileText,
                color:
                  "from-blue-500 to-cyan-500",
                bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
                trend: "+12%",
                trendUp: true,
              },
              {
                label: "Published",
                value: stats.published,
                icon: CheckCircle,
                color:
                  "from-green-500 to-emerald-500",
                bg: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
                trend: "+8%",
                trendUp: true,
              },
              {
                label: "Drafts",
                value: stats.draft,
                icon: Clock,
                color:
                  "from-yellow-500 to-amber-500",
                bg: "bg-gradient-to-br from-yellow-500/10 to-amber-500/10",
                trend: "-3%",
                trendUp: false,
              },
              {
                label: "Featured",
                value: stats.featured,
                icon: Star,
                color:
                  "from-purple-500 to-pink-500",
                bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
                trend: "+25%",
                trendUp: true,
              },
              {
                label: "Archived",
                value: stats.archived,
                icon: Archive,
                color:
                  "from-gray-500 to-slate-500",
                bg: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
                trend: "+5%",
                trendUp: true,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon
                      className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-1`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color}`}
                        style={{
                          width: `${Math.min(100, (stat.value / stats.total) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">
                      {stats.total > 0
                        ? Math.round(
                            (stat.value /
                              stats.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and filters with glass morphism */}
          <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 p-5 mb-6 shadow-xl">
            <div className="flex flex-col xl:flex-row gap-5">
              {/* Search with floating effect */}
              <div className="flex-1 relative">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search blogs by title, content, tags, or category..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(
                        e.target.value
                      );
                      setCurrentPage(1);
                    }}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 hover:shadow-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() =>
                        setSearchTerm("")
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main filter controls */}
              <div className="flex flex-wrap gap-3">
                <div className="relative group">
                  <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as any
                      );
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-700 shadow-inner appearance-none hover:shadow-lg transition-all duration-300"
                  >
                    <option value="all">
                      All Status
                    </option>
                    <option value="published">
                      Published
                    </option>
                    <option value="draft">
                      Drafts
                    </option>
                    <option value="archived">
                      Archived
                    </option>
                  </select>
                </div>

                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(
                        e.target.value
                      );
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-700 shadow-inner appearance-none hover:shadow-lg transition-all duration-300"
                  >
                    <option value="all">
                      All Categories
                    </option>
                    {categories
                      .slice(1)
                      .map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="relative group">
                  <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(
                        e.target.value as any
                      );
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-700 shadow-inner appearance-none hover:shadow-lg transition-all duration-300"
                  >
                    <option value="newest">
                      Newest First
                    </option>
                    <option value="oldest">
                      Oldest First
                    </option>
                    <option value="title">
                      Title A-Z
                    </option>
                    <option value="popular">
                      Most Popular
                    </option>
                    <option value="views">
                      Most Views
                    </option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setShowAdvancedFilters(
                      !showAdvancedFilters
                    )
                  }
                  className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Advanced
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${showAdvancedFilters ? "rotate-90" : ""}`}
                  />
                </button>

                {(searchTerm ||
                  statusFilter !== "all" ||
                  sortBy !== "newest" ||
                  selectedCategory !== "all" ||
                  dateRange.start ||
                  dateRange.end) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl hover:from-blue-200 hover:to-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Advanced filters */}
            {showAdvancedFilters && (
              <div className="mt-5 pt-5 border-t border-gray-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange(
                            (prev) => ({
                              ...prev,
                              start:
                                e.target.value,
                            })
                          )
                        }
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange(
                            (prev) => ({
                              ...prev,
                              end: e.target.value,
                            })
                          )
                        }
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Actions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const lastWeek =
                            new Date();
                          lastWeek.setDate(
                            lastWeek.getDate() - 7
                          );
                          setDateRange({
                            start: lastWeek
                              .toISOString()
                              .split("T")[0],
                            end: new Date()
                              .toISOString()
                              .split("T")[0],
                          });
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                      >
                        Last 7 days
                      </button>
                      <button
                        onClick={() => {
                          const lastMonth =
                            new Date();
                          lastMonth.setMonth(
                            lastMonth.getMonth() -
                              1
                          );
                          setDateRange({
                            start: lastMonth
                              .toISOString()
                              .split("T")[0],
                            end: new Date()
                              .toISOString()
                              .split("T")[0],
                          });
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-sm rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300"
                      >
                        Last 30 days
                      </button>
                      <button
                        onClick={() =>
                          setDateRange({
                            start: "",
                            end: "",
                          })
                        }
                        className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
                      >
                        Clear dates
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk actions bar */}
          {selectedRows.length > 0 && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-200/30 p-4 mb-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAllRows}
                    className={`p-2 rounded-lg transition-all duration-300 ${selectedRows.length === paginatedBlogs.length ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"}`}
                  >
                    {selectedRows.length ===
                    paginatedBlogs.length ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <span className="font-semibold text-gray-900">
                    {selectedRows.length} selected
                  </span>
                  <div className="hidden sm:block h-8 w-px bg-blue-200"></div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        selectedRows.forEach(
                          (id) =>
                            updateBlog.mutate({
                              id,
                              data: {
                                status:
                                  "published",
                              },
                            })
                        );
                        toast.success(
                          `${selectedRows.length} blogs published!`
                        );
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Publish
                    </button>
                    <button
                      onClick={() => {
                        selectedRows.forEach(
                          (id) =>
                            updateBlog.mutate({
                              id,
                              data: {
                                status: "draft",
                              },
                            })
                        );
                        toast.success(
                          `${selectedRows.length} blogs moved to drafts!`
                        );
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <PauseCircle className="w-4 h-4" />
                      Draft
                    </button>
                    <button
                      onClick={() => {
                        selectedRows.forEach(
                          (id) =>
                            softDeleteBlog.mutate(
                              id
                            )
                        );
                        toast.success(
                          `${selectedRows.length} blogs archived!`
                        );
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete ${selectedRows.length} blogs permanently?`
                          )
                        ) {
                          selectedRows.forEach(
                            (id) =>
                              hardDeleteBlog.mutate(
                                id
                              )
                          );
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedRows([])
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}

          {/* Results summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredAndSortedBlogs.length}
              </span>{" "}
              blogs
              {searchTerm && (
                <span className="ml-2">
                  for "
                  <span className="font-semibold text-blue-600">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="ml-2">
                  • Status:{" "}
                  <span className="font-semibold text-blue-600 capitalize">
                    {statusFilter}
                  </span>
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Page{" "}
              <span className="font-semibold text-gray-900">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {totalPages}
              </span>
            </div>
          </div>

          {/* Content area */}
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  selectedCategory !== "all" ||
                  dateRange.start ||
                  dateRange.end
                    ? "No matching blogs found"
                    : "No blogs yet"}
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  selectedCategory !== "all" ||
                  dateRange.start ||
                  dateRange.end
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first blog to get started"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() =>
                      setShowCreateModal(true)
                    }
                    className="group px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 font-semibold"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create First Blog
                  </button>
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    selectedCategory !== "all" ||
                    dateRange.start ||
                    dateRange.end) && (
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 border border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : viewMode === "list" ? (
            // List View
            <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                        <button
                          onClick={selectAllRows}
                          className={`p-1 rounded transition-all duration-300 ${selectedRows.length === paginatedBlogs.length ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          {selectedRows.length ===
                          paginatedBlogs.length ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Blog Post
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {paginatedBlogs.map(
                      (blog) => (
                        <tr
                          key={blog._id}
                          className="hover:bg-gradient-to-r from-blue-50/30 to-blue-100/10 transition-all duration-300 group"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                toggleRowSelection(
                                  blog._id
                                )
                              }
                              className={`p-1 rounded transition-all duration-300 ${selectedRows.includes(blog._id) ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                            >
                              {selectedRows.includes(
                                blog._id
                              ) ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {blog.coverImage
                                ?.url && (
                                <div className="flex-shrink-0 relative">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-lg transition-shadow duration-300">
                                    <img
                                      src={
                                        blog
                                          .coverImage
                                          .url
                                      }
                                      alt={
                                        blog.title
                                      }
                                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                  {blog.isFeatured && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-1 rounded-full shadow-lg">
                                      <Star className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                                    {blog.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {blog.excerpt ||
                                    blog.content.slice(
                                      0,
                                      100
                                    )}
                                  ...
                                </p>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        blog.slug,
                                        "Slug copied!"
                                      )
                                    }
                                    className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-all duration-300 flex items-center gap-1"
                                    title="Copy slug"
                                  >
                                    <Copy className="w-3 h-3" />
                                    Copy Slug
                                  </button>
                                  <div className="flex items-center gap-1">
                                    {blog.tags
                                      ?.slice(
                                        0,
                                        2
                                      )
                                      .map(
                                        (
                                          tag,
                                          i
                                        ) => (
                                          <span
                                            key={
                                              i
                                            }
                                            className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2 py-1 rounded-lg"
                                          >
                                            {tag}
                                          </span>
                                        )
                                      )}
                                    {blog.tags
                                      ?.length >
                                      2 && (
                                      <span className="text-xs text-gray-400">
                                        +
                                        {blog.tags
                                          .length -
                                          2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                              <Tag className="w-3 h-3 mr-1.5" />
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(
                                  blog.isDeleted
                                    ? "archived"
                                    : blog.status
                                )}
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${blog.isDeleted ? "bg-gray-100 text-gray-700" : blog.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                >
                                  {blog.isDeleted
                                    ? "Archived"
                                    : blog.status
                                        .charAt(0)
                                        .toUpperCase() +
                                      blog.status.slice(
                                        1
                                      )}
                                </span>
                              </div>
                              {blog.author
                                ?.name && (
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {
                                    blog.author
                                      .name
                                  }
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(
                                  blog.createdAt
                                )}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {blog.views || 0}{" "}
                                views •{" "}
                                {blog.likes || 0}{" "}
                                likes
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedBlog(
                                    blog
                                  );
                                  setShowDetailsModal(
                                    true
                                  );
                                }}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBlog(
                                    blog
                                  );
                                  setShowEditModal(
                                    true
                                  );
                                }}
                                className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-300 group"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() =>
                                  window.open(
                                    `/blog/${blog.slug}`,
                                    "_blank"
                                  )
                                }
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 group"
                                title="View Live"
                              >
                                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() =>
                                  toggleFeatured(
                                    blog
                                  )
                                }
                                className={`p-2 rounded-lg transition-all duration-300 group ${blog.isFeatured ? "text-yellow-600 bg-yellow-50" : "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"}`}
                                title={
                                  blog.isFeatured
                                    ? "Remove from featured"
                                    : "Add to featured"
                                }
                              >
                                <Star
                                  className={`w-4 h-4 ${blog.isFeatured ? "fill-yellow-500" : ""} group-hover:scale-110 transition-transform`}
                                />
                              </button>
                              {blog.isDeleted ? (
                                <button
                                  onClick={() =>
                                    handleRestore(
                                      blog._id
                                    )
                                  }
                                  disabled={
                                    restoreBlog.isLoading
                                  }
                                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 group disabled:opacity-50"
                                  title="Restore"
                                >
                                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedBlog(
                                      blog
                                    );
                                    setDeleteType(
                                      "soft"
                                    );
                                    setShowDeleteModal(
                                      true
                                    );
                                  }}
                                  className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 group"
                                  title="Archive"
                                >
                                  <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedBlog(
                                    blog
                                  );
                                  setDeleteType(
                                    "hard"
                                  );
                                  setShowDeleteModal(
                                    true
                                  );
                                }}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-gray-200/50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-900">
                        {Math.min(
                          startIndex +
                            itemsPerPage,
                          filteredAndSortedBlogs.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900">
                        {
                          filteredAndSortedBlogs.length
                        }
                      </span>{" "}
                      blogs
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                        className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            totalPages
                          ),
                        },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (
                            currentPage <= 3
                          ) {
                            pageNum = i + 1;
                          } else if (
                            currentPage >=
                            totalPages - 2
                          ) {
                            pageNum =
                              totalPages - 4 + i;
                          } else {
                            pageNum =
                              currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() =>
                                setCurrentPage(
                                  pageNum
                                )
                              }
                              className={`w-11 h-11 rounded-xl transition-all duration-300 font-semibold ${
                                currentPage ===
                                pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              totalPages
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Grid View
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                    hoveredCard === blog._id
                      ? "transform scale-[1.02]"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    setHoveredCard(blog._id)
                  }
                  onMouseLeave={() =>
                    setHoveredCard(null)
                  }
                >
                  {/* Cover Image with gradient overlay */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {blog.coverImage?.url ? (
                      <>
                        <img
                          src={
                            blog.coverImage.url
                          }
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No cover image
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {blog.isFeatured && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-white" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                          blog.isDeleted
                            ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                            : blog.status ===
                                "published"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                        }`}
                      >
                        {blog.isDeleted
                          ? "Archived"
                          : blog.status
                              .charAt(0)
                              .toUpperCase() +
                            blog.status.slice(1)}
                      </span>
                    </div>

                    {/* Author badge */}
                    {blog.author?.name && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-white font-medium drop-shadow-lg">
                          {blog.author.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group hover:text-blue-600 transition-colors duration-300">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.excerpt ||
                        blog.content.slice(
                          0,
                          120
                        )}
                      ...
                    </p>

                    {/* Tags */}
                    {blog.tags &&
                      blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {blog.tags
                            .slice(0, 3)
                            .map((tag, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          {blog.tags.length >
                            3 && (
                            <span className="px-2.5 py-1 text-gray-400 text-xs">
                              +
                              {blog.tags.length -
                                3}
                            </span>
                          )}
                        </div>
                      )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          <span className="font-medium">
                            {blog.category}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(
                            blog.createdAt
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views || 0}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Heart className="w-3.5 h-3.5" />
                          {blog.likes || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-200/50">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedBlog(blog);
                            setShowDetailsModal(
                              true
                            );
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBlog(blog);
                            setShowEditModal(
                              true
                            );
                          }}
                          className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-300 group"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/blog/${blog.slug}`,
                              "_blank"
                            )
                          }
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 group"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            toggleFeatured(blog)
                          }
                          className={`p-2 rounded-xl transition-all duration-300 group ${
                            blog.isFeatured
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                          }`}
                          title={
                            blog.isFeatured
                              ? "Remove from featured"
                              : "Add to featured"
                          }
                        >
                          <Star
                            className={`w-4 h-4 ${blog.isFeatured ? "fill-yellow-500" : ""} group-hover:scale-110 transition-transform`}
                          />
                        </button>
                        {blog.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(
                                blog._id
                              )
                            }
                            disabled={
                              restoreBlog.isLoading
                            }
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 group disabled:opacity-50"
                            title="Restore"
                          >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBlog(
                                blog
                              );
                              setDeleteType(
                                "soft"
                              );
                              setShowDeleteModal(
                                true
                              );
                            }}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 group"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedBlog(blog);
                            setDeleteType("hard");
                            setShowDeleteModal(
                              true
                            );
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination for grid view */}
          {viewMode === "grid" &&
            totalPages > 1 && (
              <div className="mt-6">
                <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-900">
                        {Math.min(
                          startIndex +
                            itemsPerPage,
                          filteredAndSortedBlogs.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900">
                        {
                          filteredAndSortedBlogs.length
                        }
                      </span>{" "}
                      blogs
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                        className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            totalPages
                          ),
                        },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (
                            currentPage <= 3
                          ) {
                            pageNum = i + 1;
                          } else if (
                            currentPage >=
                            totalPages - 2
                          ) {
                            pageNum =
                              totalPages - 4 + i;
                          } else {
                            pageNum =
                              currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() =>
                                setCurrentPage(
                                  pageNum
                                )
                              }
                              className={`w-11 h-11 rounded-xl transition-all duration-300 font-semibold ${
                                currentPage ===
                                pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              totalPages
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className="p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Modals */}
      <CreateEditBlogModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBlog}
        isLoading={createBlog.isLoading}
      />

      <CreateEditBlogModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBlog(null);
        }}
        onSubmit={handleUpdateBlog}
        isLoading={updateBlog.isLoading}
        initialData={selectedBlog || undefined}
        isEdit={true}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBlog(null);
        }}
        blogId={selectedBlog?._id}
        blogTitle={selectedBlog?.title}
        type={deleteType}
        onSuccess={() => {
          // Optional: Add any additional success handling
          setSelectedRows([]);
        }}
      />

      <BlogDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog || undefined}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
            border: "1px solid #E2E8F0",
            color: "#1E293B",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
          duration: 4000,
          success: {
            style: {
              background:
                "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              border: "1px solid #A7F3D0",
              color: "#065F46",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#ECFDF5",
            },
            duration: 5000,
          },
          error: {
            style: {
              background:
                "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
              border: "1px solid #FECACA",
              color: "#991B1B",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FEF2F2",
            },
            duration: 6000,
          },
          loading: {
            style: {
              background:
                "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              border: "1px solid #BAE6FD",
              color: "#0369A1",
              minWidth: "300px",
            },
          },
        }}
      />
    </>
  );
}
