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
  { header: 'Quản lý' },
  {
    title: 'Đăng nhập',
    icon: 'custom-login',
    to: '/login'
  },
];

export default menuItems;
