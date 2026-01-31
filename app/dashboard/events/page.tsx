'use client';

import React, { useState, useMemo } from 'react';
import { useEvents } from '@/lib/hooks/useEvents';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import CreateEventModal from '@/components/events/CreateEventModal';
import EditEventModal from '@/components/events/EditEventModal';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import { Event } from '@/lib/api/events';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  Grid,
  List,
  Star,
  Download,
  ChevronDown,
  ArrowUpDown,
  Clock,
  DollarSign,
  Eye,
} from 'lucide-react';

export default function EventsPage() {
  const {
    events,
    featuredEvents,
    isLoading,
    error,
    deleteEvent,
    createEvent,
    updateEvent,
    isCreating,
    isUpdating,
    isDeleting,
    searchEvents,
    refetchEvents,
  } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date-newest');
  const [showFilters, setShowFilters] = useState(false);

  /* =========================
     SEARCH & FILTERS
  ========================= */
  const searchResults = useMemo<Event[]>(() => {
    return searchQuery.trim() ? searchEvents(searchQuery) : events;
  }, [searchQuery, searchEvents, events]);

  const filteredEvents = useMemo<Event[]>(() => {
    let result = searchResults.filter((event) => {
      // Category filter
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && event.status !== selectedStatus) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all') {
        const isFree = !event.monetization?.isPaid;
        const isPaid = event.monetization?.isPaid;
        
        if (selectedPrice === 'free' && !isFree) return false;
        if (selectedPrice === 'paid' && !isPaid) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date-newest':
          return new Date(b.timeline.startDate).getTime() - new Date(a.timeline.startDate).getTime();
        case 'date-oldest':
          return new Date(a.timeline.startDate).getTime() - new Date(b.timeline.startDate).getTime();
        case 'popularity':
          return (b.registration?.currentRegistrations || 0) - (a.registration?.currentRegistrations || 0);
        case 'price-low':
          return (a.monetization?.price || 0) - (b.monetization?.price || 0);
        case 'price-high':
          return (b.monetization?.price || 0) - (a.monetization?.price || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [searchResults, selectedCategory, selectedStatus, selectedPrice, sortBy]);

  /* =========================
     STATS
  ========================= */
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === 'upcoming').length,
    ongoingEvents: events.filter((e) => e.status === 'ongoing').length,
    completedEvents: events.filter((e) => e.status === 'completed').length,
    totalParticipants: events.reduce(
      (sum, e) => sum + (e.registration?.currentRegistrations ?? 0),
      0
    ),
    featuredCount: featuredEvents.length,
    freeEvents: events.filter(e => !e.monetization?.isPaid).length,
    paidEvents: events.filter(e => e.monetization?.isPaid).length,
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteEvent(id);
      alert('Event deleted successfully');
    } catch {
      alert('Failed to delete event');
    }
  };

  const handleCreateEvent = async (formData: FormData) => {
    try {
      await createEvent(formData);
      setShowCreateModal(false);
      alert('Event created successfully');
    } catch {
      alert('Failed to create event');
    }
  };

  const handleUpdateEvent = async (id: string, data: Partial<Event>) => {
    try {
      await updateEvent({ id, data });
      setShowEditModal(false);
      setSelectedEvent(null);
      alert('Event updated successfully');
    } catch {
      alert('Failed to update event');
    }
  };

  const handleExportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'events-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  /* =========================
     LOADING
  ========================= */
  if (isLoading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-700">Loading Events</h2>
          <p className="mt-2 text-gray-500">Fetching amazing events for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        {/* Simple pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing <span className="text-yellow-300">Events</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join transformative experiences, connect with communities, and create lasting memories. 
              From tech conferences to cultural festivals, find your next adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                Create New Event
              </button>
              
              <button
                onClick={handleExportEvents}
                className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 border border-white/30 hover:border-white/50 transition-all"
              >
                <Download size={20} />
                Export Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS DASHBOARD ================= */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={Calendar}
            color="blue"
            change="+12% this month"
          />
          <StatCard
            title="Active Now"
            value={stats.ongoingEvents}
            icon={TrendingUp}
            color="green"
            change="Live events"
          />
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants.toLocaleString()}
            icon={Users}
            color="purple"
            change="+1.2k today"
          />
          <StatCard
            title="Featured"
            value={stats.featuredCount}
            icon={Star}
            color="yellow"
            change="Premium events"
          />
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container mx-auto px-4 py-12">
        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Box */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={22} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by title, description, tags, or organizer..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2 ml-1">
                  Found {searchResults.length} event{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="date-newest">Sort: Date (Newest)</option>
                  <option value="date-oldest">Sort: Date (Oldest)</option>
                  <option value="popularity">Sort: Most Popular</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {showFilters && (
              <div className="space-y-6">
                <EventFilters
                  selectedCategory={selectedCategory}
                  selectedStatus={selectedStatus}
                  onCategoryChange={setSelectedCategory}
                  onStatusChange={setSelectedStatus}
                />
                
                {/* Price Filter */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Price</h4>
                  <div className="flex flex-wrap gap-3">
                    {['all', 'free', 'paid'].map((price) => (
                      <button
                        key={price}
                        onClick={() => setSelectedPrice(price)}
                        className={`px-4 py-2 rounded-lg transition-all ${selectedPrice === price 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                        }`}
                      >
                        {price === 'all' ? 'All Prices' : price === 'free' ? 'Free Events' : 'Paid Events'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-red-800">Failed to Load Events</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={refetchEvents}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* FEATURED EVENTS SECTION */}
        {featuredEvents.length > 0 && !searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Featured Events</h2>
                  <p className="text-gray-600">Handpicked premium experiences</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                {featuredEvents.length} featured
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  className="group bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowDetailsModal(true);
                  }}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium">Featured</span>
                        <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium">
                          {event.monetization?.isPaid 
                            ? `${event.monetization?.currency} ${event.monetization?.price}` 
                            : 'Free'}
                        </span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/20 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                    <p className="text-white/80 mb-6 line-clamp-3">{event.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-white/90" />
                          <span className="text-sm font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-white/90" />
                          <span className="text-sm font-medium">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <span className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS GRID/LIST */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? 'Search Results' : 'All Events'}
                <span className="text-gray-500 text-lg ml-3">({filteredEvents.length})</span>
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {events.filter(e => e.status === 'upcoming').length} upcoming
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign size={14} />
                  {stats.freeEvents} free • {stats.paidEvents} paid
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {filteredEvents.length} of {events.length} events
              </span>
            </div>
          </div>

          {/* NO EVENTS STATE */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="inline-flex p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl mb-6">
                <Search size={64} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No events found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {searchQuery
                  ? `We couldn't find any events matching "${searchQuery}". Try different keywords or clear your search.`
                  : 'No events are available at the moment. Check back soon or create the first event!'}
              </p>
              <div className="flex gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors"
                >
                  Create First Event
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* EVENTS DISPLAY */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      viewMode={viewMode}
                      onView={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                      onEdit={() => {
                        setSelectedEvent(event);
                        setShowEditModal(true);
                      }}
                      onDelete={() => handleDeleteEvent(event._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      viewMode={viewMode}
                      onView={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                      onEdit={() => {
                        setSelectedEvent(event);
                        setShowEditModal(true);
                      }}
                      onDelete={() => handleDeleteEvent(event._id)}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {filteredEvents.length > 0 && (
                <div className="mt-16 flex items-center justify-center">
                  <nav className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((page) => (
                        <button
                          key={page}
                          className={`w-10 h-10 rounded-lg font-medium ${page === 1 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Next →
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
          isLoading={isCreating}
        />
      )}

      {showEditModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          isLoading={isUpdating}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleUpdateEvent(selectedEvent._id, data)}
        />
      )}

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isLoading={isDeleting}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onDelete={() => handleDeleteEvent(selectedEvent._id)}
        />
      )}
    </div>
  );
}

/* =========================
   STAT CARD COMPONENT
========================= */
function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  change?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colorClasses[color]} rounded-xl`}>
          <Icon className="text-white" size={24} />
        </div>
        {change && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-500 font-medium">{title}</p>
      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full`}
          style={{ width: '75%' }}
        />
      </div>
    </div>
  );
}