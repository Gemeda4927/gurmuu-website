"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import {
  X,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Tag,
  BookOpen,
  Type,
  FileText,
  Hash,
  Star,
  Globe,
  TrendingUp,
  Palette,
  Zap,
  Heart,
  Bookmark,
  PenTool,
  Layers,
  Compass,
  Target,
  Award,
  Rocket,
  Feather,
  Brush,
  Sparkle,
  Diamond,
  Crown,
  Plus,
  Camera,
  Send,
  Check,
  Palette as PaletteIcon,
  Magic,
  Wand2,
  PenLine,
  FileEdit,
  UploadCloud,
  CloudUpload,
  PartyPopper,
  Confetti,
  Trophy,
  Medal,
  TargetIcon,
  Flame,
} from "lucide-react";
import { Blog, CreateBlogDTO } from "@/lib/types/blog.types";
import toast from "react-hot-toast";

type BlogFormState = {
  title: string;
  content: string;
  excerpt: string;
  category:
    | "Technology"
    | "Health"
    | "Education"
    | "Community"
    | "Lifestyle"
    | "News";
  tags: string[];
  status: "draft" | "published";
  isFeatured: boolean;
  coverImage?: File | null;
  gallery: File[];
};

interface CreateEditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBlogDTO) => Promise<void>;
  isLoading: boolean;
  initialData?: Blog | null;
  isEdit?: boolean;
}

export default function CreateEditBlogModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  isEdit = false,
}: CreateEditBlogModalProps) {
  const [formData, setFormData] = useState<BlogFormState>({
    title: "",
    content: "",
    excerpt: "",
    category: "Technology",
    tags: [],
    status: "draft",
    isFeatured: false,
    coverImage: null,
    gallery: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        excerpt: initialData.excerpt || "",
        category: initialData.category || "Technology",
        tags: initialData.tags || [],
        status: initialData.status || "draft",
        isFeatured: initialData.isFeatured || false,
        coverImage: null,
        gallery: [],
      });

      if (initialData.coverImage?.url) {
        setCoverImagePreview(initialData.coverImage.url);
      }
      
      // Show edit toast
      if (isEdit) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
              <div className="relative p-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full">
                <FileEdit className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-yellow-900">Ready to Edit!</p>
              <p className="text-sm text-yellow-700">
                "{initialData.title}" loaded for editing
              </p>
            </div>
          </div>,
          {
            style: {
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '1px solid #FBBF24',
              padding: '16px',
              borderRadius: '14px',
              minWidth: '320px',
              backdropFilter: 'blur(10px)',
            },
            duration: 3000,
            iconTheme: {
              primary: '#F59E0B',
              secondary: '#FEF3C7',
            },
          }
        );
      }
    } else {
      resetForm();
    }
  }, [initialData, isEdit]);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "Technology",
      tags: [],
      status: "draft",
      isFeatured: false,
      coverImage: null,
      gallery: [],
    });
    setCoverImagePreview(null);
    setGalleryPreviews([]);
    setTagInput("");
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3) newErrors.title = "Title must be at least 3 characters";
    else if (formData.title.length > 200) newErrors.title = "Title must be less than 200 characters";

    if (!formData.content.trim()) newErrors.content = "Content is required";
    else if (formData.content.length < 10) newErrors.content = "Content must be at least 10 characters";

    if (formData.excerpt.length > 300) newErrors.excerpt = "Excerpt must be less than 300 characters";

    if (!isEdit && !formData.coverImage) newErrors.coverImage = "Cover image is required for new posts";

    if (formData.coverImage && formData.coverImage.size > 5 * 1024 * 1024) {
      newErrors.coverImage = "Cover image must be less than 5MB";
    }

    formData.gallery.forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        newErrors[`gallery${index}`] = `Gallery image ${index + 1} must be less than 5MB`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Validation Error</p>
            <p className="text-sm text-red-700">
              Please fix the errors in the form
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            padding: '16px',
            borderRadius: '14px',
            minWidth: '320px',
            backdropFilter: 'blur(10px)',
          },
          duration: 4000,
        }
      );
      return;
    }

    setIsSubmitting(true);
    
    // Create beautiful loading toast
    const loadingToast = toast.loading(
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-ping opacity-50"></div>
          <div className="relative p-1.5 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full">
            <Wand2 className="w-4 h-4 text-white animate-spin" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-purple-900">
            {isEdit ? "Polishing Your Blog" : "Creating Your Masterpiece"}
          </p>
          <p className="text-sm text-purple-700">
            {isEdit ? "Applying your magic touch..." : "Working our magic..."}
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
          border: '1px solid #E9D5FF',
          padding: '16px',
          borderRadius: '14px',
          minWidth: '320px',
          backdropFilter: 'blur(10px)',
        },
        duration: Infinity,
      }
    );

    try {
      const submitData: CreateBlogDTO = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status,
        isFeatured: formData.isFeatured,
      };
      if (formData.excerpt.trim()) submitData.excerpt = formData.excerpt.trim();
      if (formData.tags.length > 0) submitData.tags = formData.tags;
      if (formData.coverImage) submitData.coverImage = formData.coverImage;
      if (formData.gallery.length > 0) submitData.gallery = formData.gallery;

      await onSubmit(submitData);

      // Success toast
      toast.success(
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              {isEdit ? <PenLine className="w-5 h-5 text-white" /> : <Rocket className="w-5 h-5 text-white" />}
            </div>
          </div>
          <div>
            <p className="font-semibold text-green-900">
              {isEdit ? "Blog Updated!" : "Blog Created!"}
            </p>
            <p className="text-sm text-green-700">
              {isEdit 
                ? '"' + formData.title + '" has been updated' 
                : '"' + formData.title + '" is now live!'}
            </p>
            {formData.isFeatured && (
              <div className="flex items-center gap-1 mt-1 text-xs text-yellow-700">
                <Star className="w-3 h-3 fill-yellow-500" />
                <span>Marked as Featured Post</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            {isEdit ? <Check className="w-5 h-5 text-green-500" /> : <PartyPopper className="w-5 h-5 text-yellow-500" />}
          </div>
        </div>,
        {
          id: loadingToast,
          style: {
            background: formData.isFeatured 
              ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
              : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
            border: formData.isFeatured 
              ? '1px solid #FBBF24' 
              : '1px solid #34D399',
            padding: '16px',
            borderRadius: '14px',
            minWidth: '320px',
            backdropFilter: 'blur(10px)',
          },
          duration: 5000,
          iconTheme: {
            primary: formData.isFeatured ? '#F59E0B' : '#10B981',
            secondary: formData.isFeatured ? '#FEF3C7' : '#ECFDF5',
          },
        }
      );

      if (!isEdit) resetForm();
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      
      // Error toast
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <X className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">
              {isEdit ? "Update Failed!" : "Creation Failed!"}
            </p>
            <p className="text-sm text-red-700">
              {err.response?.data?.message ||
                err.message ||
                `Failed to ${isEdit ? 'update' : 'create'} blog`}
            </p>
          </div>
        </div>,
        {
          id: loadingToast,
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #F87171',
            padding: '16px',
            borderRadius: '14px',
            minWidth: '320px',
            backdropFilter: 'blur(10px)',
          },
          duration: 6000,
        }
      );
      setIsSubmitting(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">Invalid Image</p>
            <p className="text-sm text-amber-700">
              Please upload JPEG, PNG, GIF, or WEBP files
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FBBF24',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }
      );
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">File Too Large</p>
            <p className="text-sm text-red-700">
              Image must be less than 5MB
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }
      );
      return;
    }

    setFormData((prev) => ({ ...prev, coverImage: file }));
    setErrors({ ...errors, coverImage: "" });

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
      
      // Success toast for image upload
      toast.success(
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-blue-900">Cover Image Added!</p>
            <p className="text-sm text-blue-700">
              Beautiful choice for your blog
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #93C5FD',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#EFF6FF',
          },
        }
      );
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`Invalid type: ${file.name}`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} must be <5MB`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Gallery Upload Issues</p>
            <div className="text-sm text-red-700 space-y-1">
              {invalidFiles.slice(0, 3).map((msg, i) => (
                <p key={i}>{msg}</p>
              ))}
              {invalidFiles.length > 3 && (
                <p>...and {invalidFiles.length - 3} more</p>
              )}
            </div>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 5000,
        }
      );
    }

    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...validFiles] }));

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews((prev) => [...prev, reader.result as string]);
        
        if (validFiles.length === 1) {
          toast.success(
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900">Gallery Image Added!</p>
                <p className="text-sm text-emerald-700">
                  {file.name} added to gallery
                </p>
              </div>
            </div>,
            {
              style: {
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                border: '1px solid #A7F3D0',
                padding: '16px',
                borderRadius: '14px',
                backdropFilter: 'blur(10px)',
              },
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#ECFDF5',
              },
            }
          );
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 1) {
      toast.success(
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
            <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
              <Layers className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-purple-900">Multiple Images Added!</p>
            <p className="text-sm text-purple-700">
              {validFiles.length} images added to gallery
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '1px solid #E9D5FF',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
          iconTheme: {
            primary: '#8B5CF6',
            secondary: '#FAF5FF',
          },
        }
      );
    }
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setCoverImagePreview(null);
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-blue-900">Cover Image Removed</p>
          <p className="text-sm text-blue-700">
            Ready for a new cover image
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #93C5FD',
          padding: '16px',
          borderRadius: '14px',
          backdropFilter: 'blur(10px)',
        },
        duration: 2000,
      }
    );
  };

  const removeGalleryFile = (index: number) => {
    const removedName = formData.gallery[index].name;
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-emerald-900">Image Removed</p>
          <p className="text-sm text-emerald-700">
            {removedName} removed from gallery
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1px solid #A7F3D0',
          padding: '16px',
          borderRadius: '14px',
          backdropFilter: 'blur(10px)',
        },
        duration: 2000,
      }
    );
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">Empty Tag</p>
            <p className="text-sm text-amber-700">
              Please enter a tag name
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FBBF24',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 2000,
        }
      );
      return;
    }
    
    if (formData.tags.includes(trimmedTag)) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Duplicate Tag</p>
            <p className="text-sm text-red-700">
              "{trimmedTag}" already exists
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 2000,
        }
      );
      return;
    }
    
    if (formData.tags.length >= 10) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Tag Limit Reached</p>
            <p className="text-sm text-red-700">
              Maximum 10 tags allowed
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }
      );
      return;
    }
    
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
    setTagInput("");
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-ping"></div>
          <div className="relative p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full">
            <Tag className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-pink-900">Tag Added!</p>
          <p className="text-sm text-pink-700">
            "{trimmedTag}" added to tags
          </p>
        </div>
        <div className="ml-4">
          <Sparkle className="w-5 h-5 text-yellow-500" />
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
          border: '1px solid #FBCFE8',
          padding: '16px',
          borderRadius: '14px',
          backdropFilter: 'blur(10px)',
        },
        duration: 3000,
        iconTheme: {
          primary: '#EC4899',
          secondary: '#FDF2F8',
        },
      }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-blue-900">Tag Removed</p>
          <p className="text-sm text-blue-700">
            "{tagToRemove}" removed
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #93C5FD',
          padding: '16px',
          borderRadius: '14px',
          backdropFilter: 'blur(10px)',
        },
        duration: 2000,
      }
    );
  };

  const handleClose = () => {
    if (!isLoading && !isSubmitting) {
      resetForm();
      
      toast.success(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-600 rounded-full">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {isEdit ? "Editing Cancelled" : "Creation Cancelled"}
            </p>
            <p className="text-sm text-gray-700">
              {isEdit ? "Changes discarded" : "Ready when you are"}
            </p>
          </div>
        </div>,
        {
          style: {
            background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
            border: '1px solid #D1D5DB',
            padding: '16px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }
      );
      
      onClose();
    }
  };

  if (!isOpen) return null;

  const isProcessing = isLoading || isSubmitting;

  return (
    <>
      {/* Animated Gradient Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-in fade-in backdrop-blur-xl"
        onClick={handleClose}
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.15) 25%, rgba(14,165,233,0.1) 50%, rgba(236,72,153,0.1) 75%, rgba(245,158,11,0.1) 100%)',
        }}
      />

      {/* Floating Decorations */}
      <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {i % 4 === 0 && <Sparkle className="w-4 h-4 text-purple-300/40" />}
            {i % 4 === 1 && <Diamond className="w-3 h-3 text-blue-300/30" />}
            {i % 4 === 2 && <Heart className="w-3 h-3 text-pink-300/30" />}
            {i % 4 === 3 && <Star className="w-3 h-3 text-yellow-300/30" />}
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500 ease-out">
        <div
          className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-white/20"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(59, 130, 246, 0.1)',
          }}
        >
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />

          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200/30 px-8 py-6 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
                {isEdit ? (
                  <PenTool className="w-7 h-7 text-purple-600" />
                ) : (
                  <Sparkles className="w-7 h-7 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isEdit ? "Edit Blog Post" : "Create New Blog"}
                </h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Sparkle className="w-3 h-3 text-yellow-500" />
                  {isEdit ? "Polish your masterpiece" : "Craft your next masterpiece"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 hover:text-gray-600 hover:from-gray-200 hover:to-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Cover Image Section */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <label className="block text-lg font-semibold text-gray-800">
                  Cover Image {isEdit ? "(Optional)" : "*"}
                  <span className="text-xs font-normal text-gray-500 ml-2">First impressions matter!</span>
                </label>
              </div>
              <label className={`cursor-pointer ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}>
                <div className={`relative rounded-2xl p-8 text-center transition-all duration-300 w-full overflow-hidden ${errors.coverImage ? "border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/30" : coverImagePreview ? "border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-cyan-50/30" : "border-2 border-dashed border-gray-300 hover:border-blue-300 bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-blue-50/50 hover:to-cyan-50/30"}`}>
                  {coverImagePreview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-64 h-48 rounded-xl overflow-hidden shadow-xl">
                        <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        {!isProcessing && (
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-full hover:from-red-600 hover:to-pink-600 shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        <Brush className="w-4 h-4" />
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                        <ImageIcon className="w-10 h-10 text-gradient-to-r from-blue-500 to-purple-500" style={{ color: '#6366f1' }} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          {isEdit ? "✨ Update Cover Image" : "🎨 Upload Cover Image"}
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Award className="w-3 h-3" />
                        <span>High quality images recommended</span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    disabled={isProcessing}
                    required={!isEdit}
                  />
                </div>
              </label>
              {errors.coverImage && (
                <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{errors.coverImage}</p>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <Layers className="w-5 h-5 text-green-600" />
                </div>
                <label className="block text-lg font-semibold text-gray-800">
                  Gallery Images
                  <span className="text-xs font-normal text-gray-500 ml-2">Add supporting visuals</span>
                </label>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryChange}
                className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 hover:border-blue-300"
                disabled={isProcessing}
                multiple
              />
              {formData.gallery.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {formData.gallery.map((file, index) => (
                    <div key={index} className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {galleryPreviews[index] ? (
                        <img src={galleryPreviews[index]} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryFile(index)}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white p-1.5 rounded-full hover:from-red-600 hover:to-pink-600 shadow-xl transition-all duration-300 hover:scale-110"
                        disabled={isProcessing}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-white truncate">{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Text Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div className="relative group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50">
                    <Type className="w-5 h-5 text-amber-600" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Title *</label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => { setFormData((prev) => ({ ...prev, title: e.target.value })); setErrors({ ...errors, title: "" }); }}
                    className={`peer w-full px-6 py-4 text-lg border-2 ${errors.title ? "border-red-300 focus:ring-red-500/30" : "border-gray-200 focus:ring-blue-500/30"} rounded-2xl focus:ring-4 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white/70 placeholder:text-gray-400 font-medium`}
                    placeholder="Enter an attention-grabbing title..."
                    maxLength={200}
                    disabled={isProcessing}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {formData.title.length > 150 && (
                      <Sparkle className="w-5 h-5 text-amber-500 animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <div className="flex items-center gap-2">
                    {errors.title ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">{errors.title}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-500">Title looks good!</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gray-300 to-gray-400 transition-all duration-300"
                        style={{ width: `${Math.min(100, (formData.title.length / 200) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{formData.title.length}/200</span>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="relative group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50">
                    <Feather className="w-5 h-5 text-emerald-600" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Excerpt</label>
                </div>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => { setFormData((prev) => ({ ...prev, excerpt: e.target.value })); setErrors({ ...errors, excerpt: "" }); }}
                  rows={3}
                  className={`peer w-full px-6 py-4 border-2 ${errors.excerpt ? "border-red-300 focus:ring-red-500/30" : "border-gray-200 focus:ring-emerald-500/30"} rounded-2xl focus:ring-4 focus:border-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white/70 placeholder:text-gray-400`}
                  placeholder="Write a captivating summary of your blog post..."
                  maxLength={300}
                  disabled={isProcessing}
                />
                <div className="flex justify-between mt-2 px-1">
                  <div className="flex items-center gap-2">
                    {errors.excerpt ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">{errors.excerpt}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Optional preview text</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${formData.excerpt.length > 250 ? "text-amber-600" : "text-gray-700"}`}>
                    {formData.excerpt.length}/300
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Content *</label>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => { setFormData((prev) => ({ ...prev, content: e.target.value })); setErrors({ ...errors, content: "" }); }}
                  rows={8}
                  className={`peer w-full px-6 py-4 border-2 ${errors.content ? "border-red-300 focus:ring-red-500/30" : "border-gray-200 focus:ring-violet-500/30"} rounded-2xl focus:ring-4 focus:border-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white/70 placeholder:text-gray-400 font-sans`}
                  placeholder="Pour your thoughts here... Let your creativity flow!"
                  disabled={isProcessing}
                />
                {errors.content && (
                  <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-600 font-medium">{errors.content}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="relative group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50">
                  <Tag className="w-5 h-5 text-pink-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Tags</label>
                <span className="text-sm text-gray-500">(Max 10 tags)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/30 border border-gray-200">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:from-blue-200 hover:to-purple-200"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    <X className="w-3.5 h-3.5 hover:text-red-500 transition-colors" onClick={() => removeTag(tag)} />
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Compass className="w-4 h-4" />
                    <span className="text-sm">Add tags to help readers find your post</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a tag and press Enter..."
                  className="flex-1 px-6 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 placeholder:text-gray-400"
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={isProcessing || !tagInput.trim()}
                  className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>
              {errors.tags && (
                <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-amber-700 font-medium">{errors.tags}</p>
                </div>
              )}
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-gradient-to-br from-gray-50/50 to-blue-50/30 border border-gray-200/50">
              {/* Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50">
                    <Compass className="w-5 h-5 text-cyan-600" />
                  </div>
                  <label className="font-semibold text-gray-800">Category</label>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                  disabled={isProcessing}
                >
                  <option value="Technology" className="flex items-center gap-2">
                    <Zap className="w-4 h-4 inline" /> Technology
                  </option>
                  <option value="Health" className="flex items-center gap-2">
                    <Heart className="w-4 h-4 inline" /> Health
                  </option>
                  <option value="Education" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 inline" /> Education
                  </option>
                  <option value="Community" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 inline" /> Community
                  </option>
                  <option value="Lifestyle" className="flex items-center gap-2">
                    <Sparkle className="w-4 h-4 inline" /> Lifestyle
                  </option>
                  <option value="News" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 inline" /> News
                  </option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <label className="font-semibold text-gray-800">Status</label>
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                  disabled={isProcessing}
                >
                  <option value="draft" className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 inline" /> Save as Draft
                  </option>
                  <option value="published" className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 inline" /> Publish Now
                  </option>
                </select>
              </div>

              {/* Featured */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50">
                    <Crown className="w-5 h-5 text-yellow-600" />
                  </div>
                  <label className="font-semibold text-gray-800">Featured Post</label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    disabled={isProcessing}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gradient-to-r from-gray-300 to-gray-400 peer-focus:ring-4 peer-focus:ring-yellow-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-amber-500 shadow-inner"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {formData.isFeatured ? "✨ Featured" : "Normal"}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200/50">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-gray-300/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEdit ? (
                        <>
                          <PenTool className="w-5 h-5" />
                          Update Blog
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          Launch Blog
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
              {errors.submit && (
                <div className="flex items-center gap-2 mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-50/80 to-pink-50/80 border border-red-200">
                  <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
                  <div>
                    <p className="font-semibold text-red-700">Oops! Something went wrong</p>
                    <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}