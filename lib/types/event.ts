// Core interfaces
export interface EventFile {
  url: string;
  public_id: string;
  resource_type: string;
  original_name: string;
  size: number;
  _id: string;
  uploadedAt: string;
  id: string;
}

export interface Feedback {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

// Main event interface - renamed to avoid conflicts
export interface EventData {
  // MongoDB fields
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  id: string;

  // Event fields
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: number;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  donationDeadline: string;
  allowDonations: boolean;
  status: "draft" | "published" | "cancelled";
  files: EventFile[];
  isFeatured: boolean;
  isUrgent: boolean;
  isActive: boolean;
  isDeleted: boolean;
  feedbacks: Feedback[];
  theme?: string;
  createdBy?: string;
}

// DTOs
export interface CreateEventDTO {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: number | string;
  goalAmount: number | string;
  currency: string;
  donationDeadline: string;
  allowDonations: boolean | string;
  status: "draft" | "published" | "cancelled";
  isFeatured: boolean | string;
  isUrgent: boolean | string;
  theme?: string;
  images?: File[];
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  maxParticipants?: number | string;
  goalAmount?: number | string;
  currency?: string;
  donationDeadline?: string;
  allowDonations?: boolean | string;
  status?: "draft" | "published" | "cancelled";
  isFeatured?: boolean | string;
  isUrgent?: boolean | string;
  theme?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  event?: T;
  count?: number;
  events?: T[];
}

export interface PaginatedResponse {
  message: string;
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  events: EventData[];
}
