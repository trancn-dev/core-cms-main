export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  subCaption?: string;
  class?: string;
  extraclass?: string;
  type?: string;
}

const menuItems: menu[] = [
  { header: 'Tổng quan' },
  {
    title: 'Dashboard',
    icon: 'custom-home',
    to: '/dashboard'
  },
  { divider: true },
  { header: 'Nội dung' },
  {
    title: 'Video',
    icon: 'custom-video-play',
    children: [
      { title: 'Danh sách video', to: '/videos' },
      { title: 'Thêm video', to: '/videos/create' }
    ]
  },
  {
    title: 'Danh mục',
    icon: 'custom-layer',
    children: [
      { title: 'Danh sách danh mục', to: '/categories' },
      { title: 'Thêm danh mục', to: '/categories/create' }
    ]
  },
  {
    title: 'Tags',
    icon: 'custom-tag-outline',
    to: '/tags'
  },
  {
    title: 'Kênh',
    icon: 'custom-user-square',
    children: [
      { title: 'Danh sách kênh', to: '/channels' },
      { title: 'Thêm kênh', to: '/channels/create' }
    ]
  },
  {
    title: 'Playlist',
    icon: 'custom-folder-open',
    to: '/playlists'
  },
  { divider: true },
  { header: 'Người dùng & Tương tác' },
  {
    title: 'Người dùng',
    icon: 'custom-user',
    children: [
      { title: 'Danh sách', to: '/users' },
      { title: 'Thêm người dùng', to: '/users/create' }
    ]
  },
  {
    title: 'Bình luận',
    icon: 'custom-message-2',
    to: '/comments'
  },
  {
    title: 'Báo cáo vi phạm',
    icon: 'custom-shield',
    to: '/reports'
  },
  { divider: true },
  { header: 'Vận hành' },
  {
    title: 'Quảng cáo',
    icon: 'custom-bag',
    children: [
      { title: 'Danh sách quảng cáo', to: '/ads' },
      { title: 'Thêm quảng cáo', to: '/ads/create' }
    ]
  },
  {
    title: 'Thống kê',
    icon: 'custom-graph',
    to: '/analytics/videos'
  },
  {
    title: 'Cài đặt',
    icon: 'custom-setting-2',
    children: [
      { title: 'Cài đặt chung', to: '/settings/general' },
      { title: 'Lưu trữ', to: '/settings/storage' },
      { title: 'SEO', to: '/settings/seo' },
      { title: 'Email', to: '/settings/email' },
      { title: 'Quản trị viên', to: '/settings/admins' }
    ]
  }
];

export default menuItems;
