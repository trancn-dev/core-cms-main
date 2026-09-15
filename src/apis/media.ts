/**
 * Mock API service — thay thế bằng axios calls thật khi có backend.
 * Tất cả function trả về Promise để dễ swap sang real API.
 */
import type {
  Video, Channel, User, Category, Tag, Comment,
  Report, Playlist, Ad, DashboardStats,
  VideoFilters, UserFilters, ReportFilters, PaginatedResponse
} from '@/types/media';

// ─── Delay helper ─────────────────────────────────────────────────────────────
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockVideos: Video[] = [
  { id: 1, channelId: 1, categoryId: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', slug: 'huong-dan-vue-3', description: 'Video hướng dẫn chi tiết Vue 3 từ cơ bản đến nâng cao.', thumbnailUrl: 'https://picsum.photos/seed/vue3/320/180', duration: 5040, viewsCount: 128400, likesCount: 4820, dislikesCount: 120, commentsCount: 324, isFeatured: true, allowComments: true, status: 'published', publishedAt: '2026-08-01T00:00:00Z', createdAt: '2026-07-28T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', channel: { id: 1, name: 'Dev Việt Nam', slug: 'dev-viet-nam', verified: true }, category: { id: 1, name: 'Lập trình' } },
  { id: 2, channelId: 2, categoryId: 1, title: 'Học TypeScript trong 1 giờ', slug: 'hoc-typescript', description: 'Nắm vững TypeScript chỉ trong 1 giờ.', thumbnailUrl: 'https://picsum.photos/seed/ts/320/180', duration: 3510, viewsCount: 97200, likesCount: 3640, dislikesCount: 80, commentsCount: 210, isFeatured: false, allowComments: true, status: 'published', publishedAt: '2026-08-05T00:00:00Z', createdAt: '2026-08-03T00:00:00Z', updatedAt: '2026-08-05T00:00:00Z', channel: { id: 2, name: 'Code Pro', slug: 'code-pro', verified: true }, category: { id: 1, name: 'Lập trình' } },
  { id: 3, channelId: 3, categoryId: 2, title: 'Vuetify 3 — UI Components', slug: 'vuetify-3', duration: 2700, viewsCount: 84500, likesCount: 2980, dislikesCount: 60, commentsCount: 178, isFeatured: false, allowComments: true, status: 'published', publishedAt: '2026-08-10T00:00:00Z', createdAt: '2026-08-08T00:00:00Z', updatedAt: '2026-08-10T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/vuetify/320/180', channel: { id: 3, name: 'Frontend Studio', slug: 'frontend-studio', verified: false }, category: { id: 2, name: 'Thiết kế' } },
  { id: 4, channelId: 4, categoryId: 3, title: 'Docker cho người mới bắt đầu', slug: 'docker-co-ban', duration: 4200, viewsCount: 72100, likesCount: 2540, dislikesCount: 45, commentsCount: 142, isFeatured: false, allowComments: true, status: 'draft', createdAt: '2026-08-12T00:00:00Z', updatedAt: '2026-08-12T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/docker/320/180', channel: { id: 4, name: 'DevOps VN', slug: 'devops-vn', verified: true }, category: { id: 3, name: 'DevOps' } },
  { id: 5, channelId: 5, categoryId: 4, title: 'PostgreSQL — Tối ưu Query', slug: 'postgresql-query', duration: 3140, viewsCount: 61800, likesCount: 2120, dislikesCount: 38, commentsCount: 98, isFeatured: false, allowComments: true, status: 'processing', createdAt: '2026-08-14T00:00:00Z', updatedAt: '2026-08-14T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/sql/320/180', channel: { id: 5, name: 'DB Master', slug: 'db-master', verified: false }, category: { id: 4, name: 'Database' } },
  { id: 6, channelId: 1, categoryId: 1, title: 'Pinia — Quản lý state trong Vue', slug: 'pinia-state', duration: 2325, viewsCount: 53200, likesCount: 1980, dislikesCount: 30, commentsCount: 87, isFeatured: false, allowComments: true, status: 'published', publishedAt: '2026-08-18T00:00:00Z', createdAt: '2026-08-16T00:00:00Z', updatedAt: '2026-08-18T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/pinia/320/180', channel: { id: 1, name: 'Dev Việt Nam', slug: 'dev-viet-nam', verified: true }, category: { id: 1, name: 'Lập trình' } },
  { id: 7, channelId: 2, categoryId: 5, title: 'Git & GitHub nâng cao', slug: 'git-github', duration: 3900, viewsCount: 48900, likesCount: 1840, dislikesCount: 22, commentsCount: 64, isFeatured: false, allowComments: true, status: 'published', publishedAt: '2026-08-20T00:00:00Z', createdAt: '2026-08-18T00:00:00Z', updatedAt: '2026-08-20T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/git/320/180', channel: { id: 2, name: 'Code Pro', slug: 'code-pro', verified: true }, category: { id: 5, name: 'Công cụ' } },
  { id: 8, channelId: 4, categoryId: 3, title: 'CI/CD với GitHub Actions', slug: 'cicd-github', duration: 2650, viewsCount: 41200, likesCount: 1620, dislikesCount: 18, commentsCount: 55, isFeatured: false, allowComments: false, status: 'blocked', createdAt: '2026-08-22T00:00:00Z', updatedAt: '2026-08-25T00:00:00Z', thumbnailUrl: 'https://picsum.photos/seed/cicd/320/180', channel: { id: 4, name: 'DevOps VN', slug: 'devops-vn', verified: true }, category: { id: 3, name: 'DevOps' } }
];

const mockChannels: Channel[] = [
  { id: 1, userId: 1, name: 'Dev Việt Nam', slug: 'dev-viet-nam', description: 'Kênh chia sẻ kiến thức lập trình web, framework hiện đại và công nghệ mới nhất.', avatarUrl: undefined, coverUrl: undefined, subscribers: 128400, totalViews: 2840000, videoCount: 84, status: 'active', verified: true, verifiedAt: '2024-06-01T00:00:00Z', createdAt: '2024-03-15T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z', user: { id: 1, displayName: 'Nguyễn Văn An', email: 'an@devvn.com' } },
  { id: 2, userId: 2, name: 'Code Pro', slug: 'code-pro', description: 'Học lập trình chuyên nghiệp cùng Code Pro.', subscribers: 97200, totalViews: 1920000, videoCount: 62, status: 'active', verified: true, createdAt: '2024-04-10T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z', user: { id: 2, displayName: 'Trần Minh Đức', email: 'duc@codepro.com' } },
  { id: 3, userId: 3, name: 'Frontend Studio', slug: 'frontend-studio', description: 'UI/UX và lập trình frontend.', subscribers: 54800, totalViews: 890000, videoCount: 45, status: 'active', verified: false, createdAt: '2024-05-20T00:00:00Z', updatedAt: '2026-08-20T00:00:00Z', user: { id: 3, displayName: 'Lê Thị Hoa', email: 'hoa@frontend.studio' } },
  { id: 4, userId: 4, name: 'DevOps VN', slug: 'devops-vn', description: 'DevOps, CI/CD, Cloud Native cho developer Việt.', subscribers: 41200, totalViews: 650000, videoCount: 38, status: 'active', verified: true, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z', user: { id: 4, displayName: 'Phạm Văn Hùng', email: 'hung@devops.vn' } },
  { id: 5, userId: 5, name: 'DB Master', slug: 'db-master', description: 'SQL, NoSQL và kiến trúc database.', subscribers: 28600, totalViews: 420000, videoCount: 29, status: 'suspended', verified: false, createdAt: '2024-07-15T00:00:00Z', updatedAt: '2026-08-15T00:00:00Z', user: { id: 5, displayName: 'Hoàng Thị Mai', email: 'mai@dbmaster.com' } }
];

const mockUsers: User[] = [
  { id: 1, username: 'nguyenan', email: 'an@email.com', displayName: 'Nguyễn Văn An', role: 'creator', status: 'active', emailVerifiedAt: '2024-01-12T00:00:00Z', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 2, username: 'tranminh', email: 'duc@email.com', displayName: 'Trần Minh Đức', role: 'creator', status: 'active', emailVerifiedAt: '2024-02-07T00:00:00Z', createdAt: '2024-02-05T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 3, username: 'lethihoa', email: 'hoa@email.com', displayName: 'Lê Thị Hoa', role: 'viewer', status: 'active', emailVerifiedAt: '2024-03-14T00:00:00Z', createdAt: '2024-03-12T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 4, username: 'phamhung', email: 'hung@email.com', displayName: 'Phạm Văn Hùng', role: 'moderator', status: 'active', emailVerifiedAt: '2024-01-22T00:00:00Z', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 5, username: 'hoangmai', email: 'mai@email.com', displayName: 'Hoàng Thị Mai', role: 'creator', status: 'banned', createdAt: '2024-04-01T00:00:00Z', updatedAt: '2026-08-15T00:00:00Z' },
  { id: 6, username: 'vuquocbao', email: 'bao@email.com', displayName: 'Vũ Quốc Bảo', role: 'viewer', status: 'inactive', createdAt: '2024-05-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 7, username: 'danghuong', email: 'huong@email.com', displayName: 'Đặng Thu Hương', role: 'admin', status: 'active', emailVerifiedAt: '2023-12-03T00:00:00Z', createdAt: '2023-12-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' }
];

// ─── Video Service ─────────────────────────────────────────────────────────────

export const videoService = {
  async getList(filters: VideoFilters = {}): Promise<PaginatedResponse<Video>> {
    await delay();
    let items = [...mockVideos];
    if (filters.search) items = items.filter(v => v.title.toLowerCase().includes(filters.search!.toLowerCase()) || v.channel?.name.toLowerCase().includes(filters.search!.toLowerCase()));
    if (filters.status) items = items.filter(v => v.status === filters.status);
    if (filters.categoryId) items = items.filter(v => v.categoryId === filters.categoryId);
    if (filters.channelId) items = items.filter(v => v.channelId === filters.channelId);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
  },

  async getById(id: number): Promise<Video | null> {
    await delay();
    return mockVideos.find(v => v.id === id) ?? null;
  },

  async create(data: Partial<Video>): Promise<Video> {
    await delay(600);
    const newVideo: Video = { id: Date.now(), channelId: 0, title: '', slug: '', viewsCount: 0, likesCount: 0, dislikesCount: 0, commentsCount: 0, isFeatured: false, allowComments: true, status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
    mockVideos.push(newVideo);
    return newVideo;
  },

  async update(id: number, data: Partial<Video>): Promise<Video> {
    await delay(600);
    const idx = mockVideos.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('Video not found');
    mockVideos[idx] = { ...mockVideos[idx], ...data, updatedAt: new Date().toISOString() };
    return mockVideos[idx];
  },

  async delete(id: number): Promise<void> {
    await delay(400);
    const idx = mockVideos.findIndex(v => v.id === id);
    if (idx !== -1) mockVideos.splice(idx, 1);
  }
};

// ─── Channel Service ───────────────────────────────────────────────────────────

export const channelService = {
  async getList(): Promise<Channel[]> {
    await delay();
    return [...mockChannels];
  },

  async getById(id: number): Promise<Channel | null> {
    await delay();
    return mockChannels.find(c => c.id === id) ?? null;
  },

  async update(id: number, data: Partial<Channel>): Promise<Channel> {
    await delay(600);
    const idx = mockChannels.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Channel not found');
    mockChannels[idx] = { ...mockChannels[idx], ...data, updatedAt: new Date().toISOString() };
    return mockChannels[idx];
  }
};

// ─── User Service ──────────────────────────────────────────────────────────────

export const userService = {
  async getList(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    await delay();
    let items = [...mockUsers];
    if (filters.search) items = items.filter(u => u.displayName.toLowerCase().includes(filters.search!.toLowerCase()) || u.email.includes(filters.search!));
    if (filters.role) items = items.filter(u => u.role === filters.role);
    if (filters.status) items = items.filter(u => u.status === filters.status);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) };
  },

  async getById(id: number): Promise<User | null> {
    await delay();
    return mockUsers.find(u => u.id === id) ?? null;
  },

  async updateStatus(id: number, status: User['status']): Promise<User> {
    await delay(400);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.status = status;
    return user;
  }
};

// ─── Dashboard Service ─────────────────────────────────────────────────────────

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await delay(400);
    return {
      totalVideos: mockVideos.length,
      totalViews: mockVideos.reduce((s, v) => s + v.viewsCount, 0),
      newUsersToday: 236,
      pendingReports: 17,
      viewsGrowth: 8.2,
      usersGrowth: 3.4,
      topVideos: mockVideos.slice(0, 5).map(v => ({ id: v.id, title: v.title, viewsCount: v.viewsCount, status: v.status, channel: v.channel })),
      recentReports: []
    };
  }
};
