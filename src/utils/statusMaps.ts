import type {
  VideoStatus,
  ChannelStatus,
  UserRole,
  UserStatus,
  CommentStatus,
  ReportStatus,
  ReportReason,
  PlaylistVisibility,
  AdType,
  AdStatus,
  ReportType,
  Category
} from '@/types/media';

/**
 * Semantic tone of a status chip. Maps to the `light*` / solid theme colour
 * pairs (background / text) defined in LightTheme.ts and DarkTheme.ts.
 */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'grey' | 'primary';

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

type StatusMap<T extends string> = Record<T, StatusMeta>;

/** Background / foreground theme colour for each tone. */
export const TONE_COLORS: Record<StatusTone, { bg: string; fg: string }> = {
  success: { bg: 'lightsuccess', fg: 'success' },
  warning: { bg: 'lightwarning', fg: 'warning' },
  error: { bg: 'lighterror', fg: 'error' },
  info: { bg: 'lightinfo', fg: 'info' },
  grey: { bg: 'gray100', fg: 'lightText' },
  primary: { bg: 'lightprimary', fg: 'onLightprimary' }
};

export const videoStatusMap: StatusMap<VideoStatus> = {
  published: { label: 'Đã xuất bản', tone: 'success' },
  draft: { label: 'Bản nháp', tone: 'grey' },
  processing: { label: 'Đang xử lý', tone: 'warning' },
  unlisted: { label: 'Không công khai', tone: 'info' },
  blocked: { label: 'Bị khoá', tone: 'error' }
};

export const channelStatusMap: StatusMap<ChannelStatus> = {
  active: { label: 'Hoạt động', tone: 'success' },
  inactive: { label: 'Tạm dừng', tone: 'grey' },
  suspended: { label: 'Bị đình chỉ', tone: 'error' }
};

export const userRoleMap: StatusMap<UserRole> = {
  admin: { label: 'Quản trị viên', tone: 'primary' },
  moderator: { label: 'Kiểm duyệt viên', tone: 'info' },
  creator: { label: 'Người đăng tải', tone: 'success' },
  viewer: { label: 'Người xem', tone: 'grey' }
};

export const userStatusMap: StatusMap<UserStatus> = {
  active: { label: 'Đang hoạt động', tone: 'success' },
  inactive: { label: 'Không hoạt động', tone: 'grey' },
  banned: { label: 'Bị cấm', tone: 'error' }
};

export const commentStatusMap: StatusMap<CommentStatus> = {
  approved: { label: 'Đã duyệt', tone: 'success' },
  pending: { label: 'Chờ duyệt', tone: 'warning' },
  rejected: { label: 'Đã từ chối', tone: 'error' },
  deleted: { label: 'Đã xoá', tone: 'grey' }
};

export const reportStatusMap: StatusMap<ReportStatus> = {
  pending: { label: 'Chờ xử lý', tone: 'warning' },
  reviewed: { label: 'Đã xem xét', tone: 'info' },
  resolved: { label: 'Đã xử lý', tone: 'success' },
  dismissed: { label: 'Đã bỏ qua', tone: 'grey' }
};

export const reportReasonMap: StatusMap<ReportReason> = {
  spam: { label: 'Spam', tone: 'grey' },
  violence: { label: 'Bạo lực', tone: 'error' },
  copyright: { label: 'Bản quyền', tone: 'warning' },
  sexual: { label: 'Nội dung khiêu gợi', tone: 'error' },
  misinformation: { label: 'Thông tin sai lệch', tone: 'warning' },
  other: { label: 'Khác', tone: 'grey' }
};

export const playlistVisibilityMap: StatusMap<PlaylistVisibility> = {
  public: { label: 'Công khai', tone: 'success' },
  unlisted: { label: 'Không công khai', tone: 'info' },
  private: { label: 'Riêng tư', tone: 'grey' }
};

export const adTypeMap: StatusMap<AdType> = {
  pre_roll: { label: 'Trước video', tone: 'primary' },
  mid_roll: { label: 'Giữa video', tone: 'primary' },
  banner: { label: 'Banner', tone: 'info' },
  overlay: { label: 'Chèn nổi', tone: 'info' }
};

export const adStatusMap: StatusMap<AdStatus> = {
  active: { label: 'Đang chạy', tone: 'success' },
  paused: { label: 'Tạm dừng', tone: 'warning' },
  expired: { label: 'Đã hết hạn', tone: 'grey' }
};

export const categoryStatusMap: StatusMap<Category['status']> = {
  active: { label: 'Hoạt động', tone: 'success' },
  inactive: { label: 'Ẩn', tone: 'grey' }
};

export const reportTypeMap: StatusMap<ReportType> = {
  video: { label: 'Video', tone: 'primary' },
  comment: { label: 'Bình luận', tone: 'info' }
};

/** Every enum a `CmsStatusChip` can render, keyed by the name used in `type`. */
export const STATUS_MAPS = {
  video: videoStatusMap,
  channel: channelStatusMap,
  userRole: userRoleMap,
  userStatus: userStatusMap,
  comment: commentStatusMap,
  report: reportStatusMap,
  reportReason: reportReasonMap,
  playlist: playlistVisibilityMap,
  adType: adTypeMap,
  adStatus: adStatusMap,
  category: categoryStatusMap,
  reportType: reportTypeMap
} as const;

export type StatusMapName = keyof typeof STATUS_MAPS;

export function getStatusMeta(type: StatusMapName, value: string | undefined | null): StatusMeta {
  const map = STATUS_MAPS[type] as Record<string, StatusMeta>;
  return map?.[value ?? ''] ?? { label: value ?? '—', tone: 'grey' };
}

/** Options for a `v-select` filter, with an "all" entry first. */
export function statusFilterOptions(type: StatusMapName, allLabel: string) {
  const map = STATUS_MAPS[type] as Record<string, StatusMeta>;
  return [{ title: allLabel, value: '' }, ...Object.entries(map).map(([value, meta]) => ({ title: meta.label, value }))];
}
