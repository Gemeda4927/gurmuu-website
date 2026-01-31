// app/events/page.tsx - FULL INTEGRATED VERSION
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  AlertCircle,
  Upload,
  X,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Archive,
  BarChart3,
  Clock,
  Ban,
  Trash,
  Undo,
  AlertTriangle,
  Settings,
  Globe,
  Tag,
  Users as UsersIcon,
  Target,
  Activity,
  EyeOff,
  Eye as EyeOpen,
  Grid,
  List,
  AlertOctagon,
  Share2,
  Copy,
  Download,
  Printer,
  ExternalLink,
  Check,
  Image as ImageIcon,
  FileText,
  Link,
  Home,
  ArrowLeft,
  Shield,
  Target as TargetIcon,
  PieChart,
  TrendingDown,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import { EventData } from "@/lib/types/event";
import { useEventStore } from "@/lib/store/events.store";

type ViewMode = "list" | "details";
type LayoutMode = "grid" | "list";

export default function EventsPage() {
  const {
    events,
    deletedEvents,
    loading,
    error,
    fetchEvents,
    fetchDeletedEvents,
    createEvent,
    updateEvent,
    softDeleteEvent,
    restoreEvent,
    hardDeleteEvent,
    removeImage,
    clearError,
  } = useEventStore();

  // State
  const [viewMode, setViewMode] =
    useState<ViewMode>("list");
  const [layoutMode, setLayoutMode] =
    useState<LayoutMode>("grid");
  const [selectedEvent, setSelectedEvent] =
    useState<EventData | null>(null);
  const [showCreateModal, setShowCreateModal] =
    useState(false);
  const [showEditModal, setShowEditModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [
    showHardDeleteModal,
    setShowHardDeleteModal,
  ] = useState(false);
  const [showRestoreModal, setShowRestoreModal] =
    useState(false);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [filterCategory, setFilterCategory] =
    useState("all");
  const [filterStatus, setFilterStatus] =
    useState("all");
  const [showDeleted, setShowDeleted] =
    useState(false);
  const [currentPage, setCurrentPage] =
    useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Education",
    maxParticipants: "100",
    goalAmount: "1000",
    currency: "ETB",
    donationDeadline: "",
    allowDonations: true,
    status: "published",
    isFeatured: false,
    isUrgent: false,
    theme: "",
  });
  const [newImages, setNewImages] = useState<
    File[]
  >([]);
  const [imagesToRemove, setImagesToRemove] =
    useState<string[]>([]);
  const [previewImages, setPreviewImages] =
    useState<string[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] =
    useState("overview");
  const [copiedLink, setCopiedLink] =
    useState(false);

  // Fetch events
  useEffect(() => {
    if (showDeleted) {
      fetchDeletedEvents();
    } else {
      fetchEvents();
    }
  }, [
    showDeleted,
    fetchEvents,
    fetchDeletedEvents,
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Get current events
  const currentEvents = showDeleted
    ? deletedEvents
    : events;

  // Filter and search
  const filteredEvents = currentEvents.filter(
    (event) => {
      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        event.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" ||
        event.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" ||
        event.status === filterStatus;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  // Categories and statuses
  const categories = [
    "all",
    "Education",
    "Technology",
    "Business",
    "Health",
    "Arts",
    "Sports",
    "Community",
    "Environment",
    "Charity",
  ];

  const statuses = [
    "all",
    "draft",
    "published",
    "cancelled",
  ];

  // Event creation
  const handleCreateEvent = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        maxParticipants:
          parseInt(formData.maxParticipants) || 0,
        goalAmount:
          parseInt(formData.goalAmount) || 0,
      };

      await createEvent(data);
      toast.success(
        "Event created successfully!"
      );
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      toast.error("Failed to create event");
    }
  };

  // Event update
  const handleUpdateEvent = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const data = {
        ...formData,
        maxParticipants:
          parseInt(formData.maxParticipants) ||
          selectedEvent.maxParticipants,
        goalAmount:
          parseInt(formData.goalAmount) ||
          selectedEvent.goalAmount,
      };

      await updateEvent(selectedEvent._id, data);
      toast.success(
        "Event updated successfully!"
      );
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      toast.error("Failed to update event");
    }
  };

  // Soft delete event
  const handleSoftDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await softDeleteEvent(selectedEvent._id);
      toast.success("Event moved to trash!");
      setShowDeleteModal(false);
      setSelectedEvent(null);
      setViewMode("list");
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  // Restore event
  const handleRestoreEvent = async () => {
    if (!selectedEvent) return;
    try {
      await restoreEvent(selectedEvent._id);
      toast.success(
        "Event restored successfully!"
      );
      setShowRestoreModal(false);
      setSelectedEvent(null);
      setShowDeleted(false);
      setViewMode("list");
    } catch (err) {
      toast.error("Failed to restore event");
    }
  };

  // Hard delete event
  const handleHardDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await hardDeleteEvent(selectedEvent._id);
      toast.success("Event permanently deleted!");
      setShowHardDeleteModal(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  // File handling
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );
    setNewImages([...newImages, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages([
      ...previewImages,
      ...newPreviews,
    ]);
  };

  const handleRemoveImage = async (
    imageId: string
  ) => {
    if (!selectedEvent) return;
    try {
      await removeImage(
        selectedEvent._id,
        imageId
      );
      setImagesToRemove([
        ...imagesToRemove,
        imageId,
      ]);
      toast.success("Image removed!");
    } catch (err) {
      toast.error("Failed to remove image");
    }
  };

  const removeNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "Education",
      maxParticipants: "100",
      goalAmount: "1000",
      currency: "ETB",
      donationDeadline: "",
      allowDonations: true,
      status: "published",
      isFeatured: false,
      isUrgent: false,
      theme: "",
    });
    setNewImages([]);
    setPreviewImages([]);
    setImagesToRemove([]);
    setSelectedEvent(null);
  };

  // Format currency
  const formatCurrency = (
    amount: number,
    currency: string
  ) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "published":
        return {
          color:
            "bg-green-500/10 text-green-700 border-green-200",
          icon: (
            <Globe
              size={14}
              className="text-green-600"
            />
          ),
          text: "Published",
        };
      case "draft":
        return {
          color:
            "bg-yellow-500/10 text-yellow-700 border-yellow-200",
          icon: (
            <Edit
              size={14}
              className="text-yellow-600"
            />
          ),
          text: "Draft",
        };
      case "cancelled":
        return {
          color:
            "bg-red-500/10 text-red-700 border-red-200",
          icon: (
            <Ban
              size={14}
              className="text-red-600"
            />
          ),
          text: "Cancelled",
        };
      default:
        return {
          color:
            "bg-gray-500/10 text-gray-700 border-gray-200",
          icon: (
            <Settings
              size={14}
              className="text-gray-600"
            />
          ),
          text: status,
        };
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Education:
        "bg-blue-500/10 text-blue-700 border-blue-200",
      Technology:
        "bg-purple-500/10 text-purple-700 border-purple-200",
      Business:
        "bg-indigo-500/10 text-indigo-700 border-indigo-200",
      Health:
        "bg-pink-500/10 text-pink-700 border-pink-200",
      Arts: "bg-rose-500/10 text-rose-700 border-rose-200",
      Sports:
        "bg-orange-500/10 text-orange-700 border-orange-200",
      Community:
        "bg-teal-500/10 text-teal-700 border-teal-200",
      Environment:
        "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      Charity:
        "bg-amber-500/10 text-amber-700 border-amber-200",
    };
    return (
      colors[category] ||
      "bg-gray-500/10 text-gray-700 border-gray-200"
    );
  };

  // Copy link
  const handleCopyLink = () => {
    if (!selectedEvent) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/events/${selectedEvent._id}`
    );
    setCopiedLink(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Stats calculations
  const totalEvents = events.length;
  const totalRaised = events.reduce(
    (sum, event) =>
      sum + (event.raisedAmount || 0),
    0
  );
  const totalGoal = events.reduce(
    (sum, event) => sum + (event.goalAmount || 0),
    0
  );
  const totalParticipants = events.reduce(
    (sum, event) =>
      sum + (event.maxParticipants || 0),
    0
  );
  const featuredEvents = events.filter(
    (e) => e.isFeatured
  ).length;
  const activeEvents = events.filter(
    (e) => e.status === "published"
  ).length;
  const deletedEventsCount = deletedEvents.length;

  // When editing, populate form with selected event data
  useEffect(() => {
    if (selectedEvent && showEditModal) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date.split("T")[0],
        location: selectedEvent.location,
        category: selectedEvent.category,
        maxParticipants:
          selectedEvent.maxParticipants.toString(),
        goalAmount:
          selectedEvent.goalAmount.toString(),
        currency: selectedEvent.currency,
        donationDeadline:
          selectedEvent.donationDeadline?.split(
            "T"
          )[0] || "",
        allowDonations:
          selectedEvent.allowDonations,
        status: selectedEvent.status,
        isFeatured: selectedEvent.isFeatured,
        isUrgent: selectedEvent.isUrgent,
        theme: selectedEvent.theme || "",
      });
      setNewImages([]);
      setPreviewImages([]);
      setImagesToRemove([]);
    }
  }, [selectedEvent, showEditModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
          },
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Show different headers based on view mode */}
        {viewMode === "list" ? (
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Calendar
                      className="text-white"
                      size={28}
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Event Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Manage and organize all your
                      events in one place
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setShowDeleted(!showDeleted)
                  }
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    showDeleted
                      ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  }`}
                >
                  {showDeleted ? (
                    <>
                      <EyeOpen size={20} />
                      View Active ({events.length}
                      )
                    </>
                  ) : (
                    <>
                      <Archive size={20} />
                      View Trash (
                      {deletedEventsCount})
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <Plus size={20} />
                  New Event
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Details View Header */
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setViewMode("list")
                }
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Events
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-colors"
                >
                  {copiedLink ? (
                    <Check size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                  {copiedLink
                    ? "Copied!"
                    : "Copy Link"}
                </button>

                <button
                  onClick={() => {
                    if (selectedEvent) {
                      setFormData({
                        title:
                          selectedEvent.title,
                        description:
                          selectedEvent.description,
                        date: selectedEvent.date.split(
                          "T"
                        )[0],
                        location:
                          selectedEvent.location,
                        category:
                          selectedEvent.category,
                        maxParticipants:
                          selectedEvent.maxParticipants.toString(),
                        goalAmount:
                          selectedEvent.goalAmount.toString(),
                        currency:
                          selectedEvent.currency,
                        donationDeadline:
                          selectedEvent.donationDeadline?.split(
                            "T"
                          )[0] || "",
                        allowDonations:
                          selectedEvent.allowDonations,
                        status:
                          selectedEvent.status,
                        isFeatured:
                          selectedEvent.isFeatured,
                        isUrgent:
                          selectedEvent.isUrgent,
                        theme:
                          selectedEvent.theme ||
                          "",
                      });
                      setShowEditModal(true);
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <Edit size={20} />
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Only show in list view */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Events
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalEvents}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {activeEvents} active
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Calendar
                    className="text-blue-600"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Raised
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(
                      totalRaised,
                      "ETB"
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    of{" "}
                    {formatCurrency(
                      totalGoal,
                      "ETB"
                    )}{" "}
                    goal
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <DollarSign
                    className="text-emerald-600"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Featured Events
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {featuredEvents}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                    <Star size={14} />
                    Starred events
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Star
                    className="text-amber-600"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Participants
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalParticipants}
                  </p>
                  <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                    <UsersIcon size={14} />
                    Maximum capacity
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Users
                    className="text-purple-600"
                    size={24}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar - Only show in list view */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() =>
                      setLayoutMode("grid")
                    }
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      layoutMode === "grid"
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setLayoutMode("list")
                    }
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      layoutMode === "list"
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                {/* Filters */}
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) =>
                      setFilterCategory(
                        e.target.value
                      )
                    }
                    className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">
                      All Categories
                    </option>
                    {categories
                      .filter((c) => c !== "all")
                      .map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                        >
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="relative">
                  <BarChart3
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value
                      )
                    }
                    className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">
                      All Status
                    </option>
                    {statuses
                      .filter((s) => s !== "all")
                      .map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status
                            .charAt(0)
                            .toUpperCase() +
                            status.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                    setFilterStatus("all");
                  }}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {viewMode === "list" ? (
          /* Events List View */
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {showDeleted
                  ? "Deleted Events"
                  : "Active Events"}
                <span className="ml-3 text-gray-400 font-normal">
                  ({filteredEvents.length} found)
                </span>
              </h2>
            </div>

            {loading &&
            currentEvents.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading events...
                  </p>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200">
                <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                  {showDeleted ? (
                    <Trash
                      size={48}
                      className="text-gray-400"
                    />
                  ) : (
                    <Calendar
                      size={48}
                      className="text-gray-400"
                    />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {showDeleted
                    ? "Trash is empty"
                    : "No events found"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {showDeleted
                    ? "No events have been moved to trash yet."
                    : "Try adjusting your search filters or create a new event to get started."}
                </p>
                {!showDeleted && (
                  <button
                    onClick={() =>
                      setShowCreateModal(true)
                    }
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    <Plus size={20} />
                    Create Your First Event
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Events Grid/List */}
                <div
                  className={`gap-6 ${layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"}`}
                >
                  {filteredEvents
                    .slice(0, 12)
                    .map((event) => (
                      <div
                        key={event._id}
                        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-500 ${
                          layoutMode === "list"
                            ? "flex"
                            : ""
                        }`}
                      >
                        {/* Event Image */}
                        <div
                          className={`relative ${layoutMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}
                        >
                          {event.files &&
                          event.files.length >
                            0 ? (
                            <Image
                              src={
                                event.files[0].url
                              }
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <Calendar
                                size={48}
                                className="text-white/50"
                              />
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-4 left-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusConfig(event.status).color}`}
                            >
                              {
                                getStatusConfig(
                                  event.status
                                ).icon
                              }
                              {
                                getStatusConfig(
                                  event.status
                                ).text
                              }
                            </div>
                          </div>

                          {/* Featured Badge */}
                          {event.isFeatured && (
                            <div className="absolute top-4 right-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                                <Star size={12} />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Event Content */}
                        <div
                          className={`p-6 ${layoutMode === "list" ? "flex-1" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                                >
                                  <Tag
                                    size={12}
                                  />
                                  {event.category}
                                </span>
                                {event.isUrgent && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold">
                                    <AlertCircle
                                      size={12}
                                    />
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {event.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {
                                  event.description
                                }
                              </p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar
                                  size={16}
                                  className="text-blue-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Date
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {format(
                                    new Date(
                                      event.date
                                    ),
                                    "MMM dd, yyyy"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 rounded-lg">
                                <MapPin
                                  size={16}
                                  className="text-red-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Location
                                </p>
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <Users
                                  size={16}
                                  className="text-green-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Capacity
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {
                                    event.maxParticipants
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <DollarSign
                                  size={16}
                                  className="text-purple-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Goal
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatCurrency(
                                    event.goalAmount,
                                    event.currency
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>
                                Funds Raised
                              </span>
                              <span className="font-semibold">
                                {(
                                  (event.raisedAmount /
                                    event.goalAmount) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                                style={{
                                  width: `${Math.min((event.raisedAmount / event.goalAmount) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCurrency(
                                event.raisedAmount,
                                event.currency
                              )}{" "}
                              raised
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedEvent(
                                    event
                                  );
                                  setViewMode(
                                    "details"
                                  );
                                }}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              {!showDeleted && (
                                <button
                                  onClick={() => {
                                    setSelectedEvent(
                                      event
                                    );
                                    setShowEditModal(
                                      true
                                    );
                                  }}
                                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                                >
                                  <Edit
                                    size={16}
                                  />
                                  Edit
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {!showDeleted ? (
                                <button
                                  onClick={() => {
                                    setSelectedEvent(
                                      event
                                    );
                                    setShowDeleteModal(
                                      true
                                    );
                                  }}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Move to Trash"
                                >
                                  <Trash2
                                    size={18}
                                  />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedEvent(
                                        event
                                      );
                                      setShowRestoreModal(
                                        true
                                      );
                                    }}
                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                                    title="Restore"
                                  >
                                    <Undo
                                      size={18}
                                    />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedEvent(
                                        event
                                      );
                                      setShowHardDeleteModal(
                                        true
                                      );
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    title="Delete Permanently"
                                  >
                                    <Trash
                                      size={18}
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination */}
                {filteredEvents.length > 12 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.max(prev - 1, 1)
                        )
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((page) => (
                        <button
                          key={page}
                          onClick={() =>
                            setCurrentPage(page)
                          }
                          className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      {Math.ceil(
                        filteredEvents.length / 12
                      ) > 3 && (
                        <>
                          <span className="text-gray-400">
                            ...
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.ceil(
                                  filteredEvents.length /
                                    12
                                )
                              )
                            }
                            className={`w-12 h-12 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors ${
                              currentPage ===
                              Math.ceil(
                                filteredEvents.length /
                                  12
                              )
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                          >
                            {Math.ceil(
                              filteredEvents.length /
                                12
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(
                          (prev) => prev + 1
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(
                          filteredEvents.length /
                            12
                        )
                      }
                      className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Event Details View */
          selectedEvent && (
            <div className="animate-fadeIn">
              {/* Hero Section */}
              <div className="relative rounded-2xl overflow-hidden mb-8">
                {selectedEvent.files &&
                selectedEvent.files.length > 0 ? (
                  <div className="relative h-80">
                    <Image
                      src={
                        selectedEvent.files[0].url
                      }
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-80 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Calendar
                      size={64}
                      className="text-white/30"
                    />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold ${getStatusConfig(selectedEvent.status).color}`}
                    >
                      {
                        getStatusConfig(
                          selectedEvent.status
                        ).icon
                      }
                      {
                        getStatusConfig(
                          selectedEvent.status
                        ).text
                      }
                    </div>
                    {selectedEvent.isFeatured && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg">
                        <Star size={14} />
                        Featured
                      </span>
                    )}
                    {selectedEvent.isUrgent && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold shadow-lg">
                        <AlertCircle size={14} />
                        Urgent
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {selectedEvent.title}
                  </h1>
                  <p className="text-white/90">
                    {selectedEvent.description.substring(
                      0,
                      100
                    )}
                    ...
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Tabs Navigation */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="border-b border-gray-200">
                      <nav
                        className="flex space-x-8 px-6"
                        aria-label="Tabs"
                      >
                        {[
                          "overview",
                          "gallery",
                          "funding",
                          "participants",
                        ].map((tab) => (
                          <button
                            key={tab}
                            onClick={() =>
                              setActiveDetailsTab(
                                tab
                              )
                            }
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeDetailsTab ===
                              tab
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {tab
                              .charAt(0)
                              .toUpperCase() +
                              tab.slice(1)}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {/* Overview Tab */}
                      {activeDetailsTab ===
                        "overview" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Description
                            </h3>
                            <p className="text-gray-700 whitespace-pre-line">
                              {
                                selectedEvent.description
                              }
                            </p>
                          </div>

                          {selectedEvent.theme && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Theme
                              </h3>
                              <p className="text-gray-700">
                                {
                                  selectedEvent.theme
                                }
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar
                                  className="text-blue-600"
                                  size={20}
                                />
                                Event Date & Time
                              </h4>
                              <p className="text-gray-700">
                                {format(
                                  new Date(
                                    selectedEvent.date
                                  ),
                                  "EEEE, MMMM dd, yyyy"
                                )}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                {format(
                                  new Date(
                                    selectedEvent.date
                                  ),
                                  "hh:mm a"
                                )}
                              </p>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin
                                  className="text-red-600"
                                  size={20}
                                />
                                Location
                              </h4>
                              <p className="text-gray-700">
                                {
                                  selectedEvent.location
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gallery Tab */}
                      {activeDetailsTab ===
                        "gallery" && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Event Gallery
                          </h3>
                          {selectedEvent.files &&
                          selectedEvent.files
                            .length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedEvent.files.map(
                                (file, index) => (
                                  <div
                                    key={index}
                                    className="relative group"
                                  >
                                    <Image
                                      src={
                                        file.url
                                      }
                                      alt={`${selectedEvent.title} ${index + 1}`}
                                      width={300}
                                      height={200}
                                      className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl" />
                                    {!imagesToRemove.includes(
                                      file.public_id
                                    ) && (
                                      <button
                                        onClick={() =>
                                          handleRemoveImage(
                                            file.public_id
                                          )
                                        }
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                      >
                                        <X
                                          size={
                                            14
                                          }
                                        />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                              <ImageIcon
                                size={48}
                                className="mx-auto text-gray-400 mb-4"
                              />
                              <p className="text-gray-600">
                                No images uploaded
                                yet
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Funding Tab */}
                      {activeDetailsTab ===
                        "funding" && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Fundraising
                                  Progress
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Current status
                                  of donations
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  {(
                                    (selectedEvent.raisedAmount /
                                      selectedEvent.goalAmount) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {formatCurrency(
                                    selectedEvent.raisedAmount,
                                    selectedEvent.currency
                                  )}{" "}
                                  of{" "}
                                  {formatCurrency(
                                    selectedEvent.goalAmount,
                                    selectedEvent.currency
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                                style={{
                                  width: `${Math.min((selectedEvent.raisedAmount / selectedEvent.goalAmount) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                              <DollarSign
                                className="mx-auto text-green-600 mb-2"
                                size={24}
                              />
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  selectedEvent.goalAmount,
                                  selectedEvent.currency
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                Goal Amount
                              </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                              <TrendingUp
                                className="mx-auto text-blue-600 mb-2"
                                size={24}
                              />
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  selectedEvent.raisedAmount,
                                  selectedEvent.currency
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                Amount Raised
                              </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                              <Target
                                className="mx-auto text-purple-600 mb-2"
                                size={24}
                              />
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  selectedEvent.goalAmount -
                                    selectedEvent.raisedAmount,
                                  selectedEvent.currency
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                Amount Needed
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Activity
                        className="text-blue-600"
                        size={20}
                      />
                      Quick Stats
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users
                              className="text-blue-600"
                              size={18}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Participants
                            </p>
                            <p className="font-medium text-gray-900">
                              {
                                selectedEvent.maxParticipants
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign
                              className="text-green-600"
                              size={18}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Currency
                            </p>
                            <p className="font-medium text-gray-900">
                              {
                                selectedEvent.currency
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BarChart3
                              className="text-purple-600"
                              size={18}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Feedbacks
                            </p>
                            <p className="font-medium text-gray-900">
                              {selectedEvent
                                .feedbacks
                                ?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Tag
                              className="text-amber-600"
                              size={18}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Category
                            </p>
                            <p className="font-medium text-gray-900">
                              {
                                selectedEvent.category
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Timeline */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Clock
                        className="text-purple-600"
                        size={20}
                      />
                      Event Timeline
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Created
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(
                              new Date(
                                selectedEvent.createdAt
                              ),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Last Updated
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(
                              new Date(
                                selectedEvent.updatedAt
                              ),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Event Date
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(
                              new Date(
                                selectedEvent.date
                              ),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Event Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Event ID
                        </p>
                        <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono text-gray-800 break-all">
                          {selectedEvent._id}
                        </code>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Donations
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedEvent.allowDonations
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Donation Deadline
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedEvent.donationDeadline
                            ? format(
                                new Date(
                                  selectedEvent.donationDeadline
                                ),
                                "MMM dd, yyyy"
                              )
                            : "No deadline"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Modals (Create, Edit, Delete) - Same as before but with integrated image handling */}
        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create New Event
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Fill in the details to
                      create your event
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleCreateEvent}
                className="p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Same as before */}
                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Tag
                            size={20}
                            className="text-blue-600"
                          />
                        </div>
                        Basic Information
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            required
                            value={
                              formData.description
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description:
                                  e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe your event..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location & Date */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MapPin
                            size={20}
                            className="text-green-600"
                          />
                        </div>
                        Location & Date
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={
                              formData.location
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Where is the event?"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Event Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={
                                formData.date
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  date: e.target
                                    .value,
                                })
                              }
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Donation Deadline
                            </label>
                            <input
                              type="date"
                              value={
                                formData.donationDeadline
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  donationDeadline:
                                    e.target
                                      .value,
                                })
                              }
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Updated with image handling */}
                  <div className="space-y-8">
                    {/* Category & Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Settings
                            size={20}
                            className="text-purple-600"
                          />
                        </div>
                        Category & Settings
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={
                              formData.category
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {categories
                              .filter(
                                (c) => c !== "all"
                              )
                              .map((cat) => (
                                <option
                                  key={cat}
                                  value={cat}
                                >
                                  {cat}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                          </label>
                          <select
                            value={
                              formData.status
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target
                                  .value as any,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="draft">
                              Draft
                            </option>
                            <option value="published">
                              Published
                            </option>
                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </div>

                        {/* Toggle Settings */}
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Star
                                size={18}
                                className="text-yellow-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Featured Event
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.isFeatured
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isFeatured:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <AlertCircle
                                size={18}
                                className="text-red-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Urgent Event
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.isUrgent
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isUrgent:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <DollarSign
                                size={18}
                                className="text-green-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Accept Donations
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.allowDonations
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    allowDonations:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Images */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Upload
                            size={20}
                            className="text-pink-600"
                          />
                        </div>
                        Event Images
                      </h3>

                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={32}
                        />
                        <p className="text-gray-600 mb-3">
                          Add images to your event
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={
                            handleFileChange
                          }
                          className="hidden"
                          id="create-image-upload"
                        />
                        <label
                          htmlFor="create-image-upload"
                          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer text-sm"
                        >
                          Select Images
                        </label>
                        <p className="text-xs text-gray-500 mt-3">
                          Supports JPG, PNG, WebP
                          • Max 5MB each
                        </p>
                      </div>

                      {/* Image Previews */}
                      {previewImages.length >
                        0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Selected Images
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {previewImages.map(
                              (
                                preview,
                                index
                              ) => (
                                <div
                                  key={index}
                                  className="relative group"
                                >
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeNewImage(
                                        index
                                      )
                                    }
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                                  >
                                    <X
                                      size={12}
                                    />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-8 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-3 shadow-lg shadow-blue-500/30"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Event Modal - UPDATED WITH IMAGE HANDLING */}
        {showEditModal && selectedEvent && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Edit Event
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Update the event details
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleUpdateEvent}
                className="p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Basic Information */}
                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Tag
                            size={20}
                            className="text-blue-600"
                          />
                        </div>
                        Basic Information
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            required
                            value={
                              formData.description
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description:
                                  e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe your event..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <input
                            type="text"
                            value={formData.theme}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                theme:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Event theme"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location & Date */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MapPin
                            size={20}
                            className="text-green-600"
                          />
                        </div>
                        Location & Date
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={
                              formData.location
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Event Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={
                                formData.date
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  date: e.target
                                    .value,
                                })
                              }
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Donation Deadline
                            </label>
                            <input
                              type="date"
                              value={
                                formData.donationDeadline
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  donationDeadline:
                                    e.target
                                      .value,
                                })
                              }
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Settings & Images */}
                  <div className="space-y-8">
                    {/* Category & Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Settings
                            size={20}
                            className="text-purple-600"
                          />
                        </div>
                        Category & Settings
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={
                              formData.category
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {categories
                              .filter(
                                (c) => c !== "all"
                              )
                              .map((cat) => (
                                <option
                                  key={cat}
                                  value={cat}
                                >
                                  {cat}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                          </label>
                          <select
                            value={
                              formData.status
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target
                                  .value as any,
                              })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="draft">
                              Draft
                            </option>
                            <option value="published">
                              Published
                            </option>
                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </div>

                        {/* Toggle Settings */}
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Star
                                size={18}
                                className="text-yellow-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Featured Event
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.isFeatured
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isFeatured:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <AlertCircle
                                size={18}
                                className="text-red-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Urgent Event
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.isUrgent
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isUrgent:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <DollarSign
                                size={18}
                                className="text-green-600"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Accept Donations
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  formData.allowDonations
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    allowDonations:
                                      e.target
                                        .checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Images - UPDATED */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Upload
                            size={20}
                            className="text-pink-600"
                          />
                        </div>
                        Event Images
                      </h3>

                      {/* Current Images */}
                      {selectedEvent.files &&
                        selectedEvent.files
                          .length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Current Images
                            </h4>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {selectedEvent.files.map(
                                (file, index) => (
                                  <div
                                    key={index}
                                    className="relative group"
                                  >
                                    <Image
                                      src={
                                        file.url
                                      }
                                      alt={`Event image ${index + 1}`}
                                      width={100}
                                      height={100}
                                      className="w-full h-24 object-cover rounded-lg"
                                    />
                                    {imagesToRemove.includes(
                                      file.public_id
                                    ) ? (
                                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs">
                                          Removed
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveImage(
                                            file.public_id
                                          )
                                        }
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                      >
                                        <X
                                          size={
                                            12
                                          }
                                        />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Add New Images */}
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={32}
                        />
                        <p className="text-gray-600 mb-3">
                          Add new images
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={
                            handleFileChange
                          }
                          className="hidden"
                          id="edit-image-upload"
                        />
                        <label
                          htmlFor="edit-image-upload"
                          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer text-sm"
                        >
                          Add New Images
                        </label>
                      </div>

                      {/* New Image Previews */}
                      {previewImages.length >
                        0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            New Images
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {previewImages.map(
                              (
                                preview,
                                index
                              ) => (
                                <div
                                  key={index}
                                  className="relative group"
                                >
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeNewImage(
                                        index
                                      )
                                    }
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                                  >
                                    <X
                                      size={12}
                                    />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-3 shadow-lg shadow-blue-500/30"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Update Event
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedEvent && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl">
                    <AlertTriangle
                      className="text-white"
                      size={32}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Move to Trash
                    </h3>
                    <p className="text-gray-600">
                      This event will be moved to
                      trash
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-yellow-800 font-medium">
                    {selectedEvent.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar
                      size={14}
                      className="text-yellow-600"
                    />
                    <p className="text-yellow-600 text-sm">
                      {format(
                        new Date(
                          selectedEvent.date
                        ),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      handleSoftDeleteEvent
                    }
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-3"
                  >
                    <Trash2 size={20} />
                    {loading
                      ? "Moving..."
                      : "Move to Trash"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restore Confirmation Modal */}
        {showRestoreModal && selectedEvent && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                    <RefreshCw
                      className="text-white"
                      size={32}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Restore Event
                    </h3>
                    <p className="text-gray-600">
                      Restore this event to active
                      events
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    {selectedEvent.title}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Deleted on{" "}
                    {format(
                      new Date(
                        selectedEvent.updatedAt
                      ),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowRestoreModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestoreEvent}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-3"
                  >
                    <RefreshCw size={20} />
                    {loading
                      ? "Restoring..."
                      : "Restore Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hard Delete Confirmation Modal */}
        {showHardDeleteModal && selectedEvent && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl">
                    <AlertOctagon
                      className="text-white"
                      size={32}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Permanently Delete
                    </h3>
                    <p className="text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-800 font-medium">
                    {selectedEvent.title}
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    All event data will be
                    permanently removed
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowHardDeleteModal(
                        false
                      );
                      setSelectedEvent(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      handleHardDeleteEvent
                    }
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-3 shadow-lg shadow-red-500/30"
                  >
                    <Trash size={20} />
                    {loading
                      ? "Deleting..."
                      : "Delete Permanently"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
