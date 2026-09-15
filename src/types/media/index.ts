// ─── Enums ────────────────────────────────────────────────────────────────────

export type VideoStatus = 'draft' | 'processing' | 'published' | 'unlisted' | 'blocked';
export type ChannelStatus = 'active' | 'inactive' | 'suspended';
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';
export type CommentStatus = 'approved' | 'pending' | 'rejected' | 'deleted';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type ReportReason = 'spam' | 'violence' | 'copyright' | 'sexual' | 'misinformation' | 'other';
export type ReportType = 'video' | 'comment';
export type PlaylistVisibility = 'public' | 'unlisted' | 'private';
export type AdType = 'pre_roll' | 'mid_roll' | 'banner' | 'overlay';
export type AdStatus = 'active' | 'paused' | 'expired';

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  parentId?: number;
  parent?: Pick<Category, 'id' | 'name'>;
  sortOrder: number;
  status: 'active' | 'inactive';
  videoCount?: number;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  videoCount?: number;
  createdAt: string;
}

export interface Channel {
  id: number;
  userId: number;
  user?: Pick<User, 'id' | 'displayName' | 'email'>;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  coverUrl?: string;
  subscribers: number;
  totalViews: number;
  videoCount?: number;
  status: ChannelStatus;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoQuality {
  id: number;
  videoId: number;
  label: '360p' | '480p' | '720p' | '1080p' | '4K';
  fileUrl: string;
  fileSize?: number;
  bitrate?: number;
}

export interface Video {
  id: number;
  channelId: number;
  channel?: Pick<Channel, 'id' | 'name' | 'slug' | 'verified'>;
  categoryId?: number;
  category?: Pick<Category, 'id' | 'name'>;
  tags?: Tag[];
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  qualities?: VideoQuality[];
  duration?: number;        // seconds
  fileSize?: number;        // bytes
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  isFeatured: boolean;
  allowComments: boolean;
  status: VideoStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  videoId: number;
  video?: Pick<Video, 'id' | 'title'>;
  userId: number;
  user?: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
  parentId?: number;
  content: string;
  likesCount: number;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: number;
  userId: number;
  user?: Pick<User, 'id' | 'displayName'>;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  visibility: PlaylistVisibility;
  videoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistVideo {
  playlistId: number;
  videoId: number;
  video: Pick<Video, 'id' | 'title' | 'thumbnailUrl' | 'duration' | 'channel'>;
  sortOrder: number;
  addedAt: string;
}

export interface Report {
  id: number;
  reporterId: number;
  reporter?: Pick<User, 'id' | 'displayName' | 'email'>;
  type: ReportType;
  videoId?: number;
  video?: Pick<Video, 'id' | 'title'>;
  commentId?: number;
  comment?: Pick<Comment, 'id' | 'content'>;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt: string;
}

export interface Ad {
  id: number;
  title: string;
  type: AdType;
  creativeUrl: string;
  targetUrl?: string;
  skipAfter?: number;       // seconds, null = non-skippable
  impressions: number;
  clicks: number;
  ctr?: number;             // computed: clicks/impressions
  startDate?: string;
  endDate?: string;
  status: AdStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  key: string;
  value: string;
  group: 'general' | 'storage' | 'seo' | 'email';
}

// ─── API Response Wrappers ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VideoFilters {
  search?: string;
  status?: VideoStatus | '';
  categoryId?: number;
  channelId?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
  page?: number;
  limit?: number;
}

export interface ReportFilters {
  type?: ReportType | '';
  status?: ReportStatus | '';
  page?: number;
  limit?: number;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  newUsersToday: number;
  pendingReports: number;
  viewsGrowth: number;       // percentage
  usersGrowth: number;
  topVideos: Pick<Video, 'id' | 'title' | 'viewsCount' | 'channel' | 'status'>[];
  recentReports: Pick<Report, 'id' | 'type' | 'reason' | 'status' | 'createdAt' | 'video' | 'reporter'>[];
}
