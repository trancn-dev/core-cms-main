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
  {
    title: 'Dashboard',
    icon: 'custom-home',
    to: '/dashboard'
  },
  {
    title: 'Nội dung',
    icon: 'custom-video-play',
    children: [
      { title: 'Danh sách video', to: '/videos' },
      { title: 'Thêm video', to: '/videos/create' },
      { title: 'Danh mục', to: '/categories' },
      { title: 'Tags', to: '/tags' },
      { title: 'Kênh', to: '/channels' },
      { title: 'Playlist', to: '/playlists' }
    ]
  },
  {
    title: 'Người dùng',
    icon: 'custom-user',
    children: [
      { title: 'Danh sách người dùng', to: '/users' },
      { title: 'Bình luận', to: '/comments' },
      { title: 'Báo cáo vi phạm', to: '/reports' }
    ]
  },
  {
    title: 'Vận hành',
    icon: 'custom-graph',
    children: [
      { title: 'Quảng cáo', to: '/ads' },
      { title: 'Thống kê', to: '/analytics/videos' }
    ]
  },
  {
    title: 'Cài đặt',
    icon: 'custom-setting-2',
    to: '/settings/general'
  }
];

export default menuItems;
