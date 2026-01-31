// Create a new file: app/events/details/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  AlertCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  Download,
  Printer,
  Globe,
  Clock,
  Target,
  TrendingUp,
  PieChart,
  Image as ImageIcon,
  FileText,
  Video,
  Link,
  Copy,
  CheckCircle,
  ExternalLink,
  Shield,
  Users as UsersIcon,
  Activity,
  BarChart3,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import { EventData } from "@/lib/types/event";
import { useEventStore } from "@/lib/store/events.store";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { events, fetchEvents, loading } = useEventStore();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundEvent = events.find(e => e._id === params.id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        fetchEvents().then(() => {
          const refetchedEvent = events.find(e => e._id === params.id);
          if (refetchedEvent) {
            setEvent(refetchedEvent);
          } else {
            toast.error("Event not found");
            router.push("/events");
          }
        });
      }
    }
  }, [params.id, events, fetchEvents, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <button
            onClick={() => router.push("/events")}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to events
          </button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <button
                onClick={() => router.push("/events")}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Events
              </button>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  <Globe size={14} />
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                {event.isFeatured && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold">
                    <Star size={14} />
                    Featured
                  </span>
                )}
                {event.isUrgent && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold">
                    <AlertCircle size={14} />
                    Urgent
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-white/90 text-lg max-w-3xl">{event.description.substring(0, 150)}...</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {event.files && event.files.length > 0 ? (
                <div className="relative h-96">
                  <Image
                    src={event.files[0].url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ImageIcon size={64} className="text-white/30" />
                </div>
              )}
              
              {/* Image Gallery */}
              {event.files && event.files.length > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {event.files.slice(1).map((file, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={file.url}
                          alt={`${event.title} ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {["overview", "details", "funding", "participants", "documents"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                      <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                    </div>
                    
                    {event.theme && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                        <p className="text-gray-700">{event.theme}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar className="text-blue-600" size={20} />
                          Event Date & Time
                        </h4>
                        <p className="text-gray-700">
                          {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {format(new Date(event.date), "hh:mm a")}
                        </p>
                      </div>

                      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <MapPin className="text-red-600" size={20} />
                          Location
                        </h4>
                        <p className="text-gray-700">{event.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                        <p className="text-gray-700">{event.category}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Max Participants</h4>
                        <p className="text-gray-700">{event.maxParticipants}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Donation Deadline</h4>
                        <p className="text-gray-700">
                          {event.donationDeadline 
                            ? format(new Date(event.donationDeadline), "MMM dd, yyyy")
                            : "No deadline"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Donations</h4>
                        <p className="text-gray-700">
                          {event.allowDonations ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Event ID</h4>
                      <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono text-gray-800">
                        {event._id}
                      </code>
                    </div>
                  </div>
                )}

                {/* Funding Tab */}
                {activeTab === "funding" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Fundraising Progress</h4>
                          <p className="text-gray-600 text-sm">Current status of donations</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {((event.raisedAmount / event.goalAmount) * 100).toFixed(1)}%
                          </p>
                          <p className="text-gray-600 text-sm">
                            {formatCurrency(event.raisedAmount, event.currency)} of {formatCurrency(event.goalAmount, event.currency)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min((event.raisedAmount / event.goalAmount) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                        <DollarSign className="mx-auto text-green-600 mb-2" size={24} />
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(event.goalAmount, event.currency)}
                        </p>
                        <p className="text-sm text-gray-600">Goal Amount</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                        <TrendingUp className="mx-auto text-blue-600 mb-2" size={24} />
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(event.raisedAmount, event.currency)}
                        </p>
                        <p className="text-sm text-gray-600">Amount Raised</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                        <Target className="mx-auto text-purple-600 mb-2" size={24} />
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(event.goalAmount - event.raisedAmount, event.currency)}
                        </p>
                        <p className="text-sm text-gray-600">Amount Needed</p>
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
                <Activity className="text-blue-600" size={20} />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="font-medium text-gray-900">{event.maxParticipants}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="font-medium text-gray-900">{event.currency}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Feedbacks</p>
                      <p className="font-medium text-gray-900">{event.feedbacks?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Tag className="text-amber-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">{event.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push(`/events/edit/${event._id}`)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
                >
                  <Edit size={20} />
                  Edit Event
                </button>

                <button
                  onClick={() => {
                    if (confirm("Move this event to trash?")) {
                      // Implement delete function
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3.5 rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                >
                  <Trash2 size={20} />
                  Move to Trash
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition-colors">
                    <Download size={18} />
                    Export
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition-colors">
                    <Printer size={18} />
                    Print
                  </button>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-purple-600" size={20} />
                Event Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.updatedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Event Date</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}