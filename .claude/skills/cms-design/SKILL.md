---
name: cms-design
description: Draft mockups or implement UI screens for this CMS (media/post/cast/genre management) using the project's actual Vuetify design system — real color tokens, typography scale, radius/shadow, layout structure, and existing shared components — instead of generic defaults. Use before drafting any screen with /design for this project, or before writing/styling a new Vue page or component here.
---

# Design system của core-cms-main

Codebase này là template **mua lại** (Able Pro Vuetify admin) — nguyên tắc số 1: **tái dùng token & component có sẵn**, không tự bịa màu/spacing mới, không dựng design system song song.

## Khi nào dùng skill này
- Trước khi phác thảo (mockup/wireframe) một màn hình cho CMS này bằng `/design`.
- Trước khi tự viết code Vue/SCSS cho một trang hoặc component UI mới trong dự án.
- Khi cần một màn hình mới trông "cùng bộ" với Dashboard/Login hiện có.

## Design tokens — theme mặc định (`DefaultTheme` / `DarkDefaultTheme`, `src/theme/LightTheme.ts` & `DarkTheme.ts`)

### Màu chính
| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| primary | `#4680FF` | `#6293FF` | hành động chính, link, active state |
| secondary | `#5B6B79` | `#DBE0E5` | text phụ, icon phụ |
| info | `#3ec9d6` | `#3ec9d6` | thông báo trung tính |
| success | `#2ca87f` | `#2ca87f` | trạng thái thành công |
| warning | `#e58a00` | `#e58a00` | cảnh báo |
| error | `#dc2626` | `#dc2626` | lỗi, xoá |
| surface | `#fff` | `#1D2630` | nền card/panel |
| containerBg | `#F8F9FA` | `#131920` | nền layout tổng |
| border-color / borderLight | `#e8ebee` | `#29313b` / `#3E4853` | viền card, divider |
| darkText | `#1D2630` | `#dadcde` | text chính |
| lightText | `#5B6B79` | `#798491` | text phụ, caption |

Mỗi màu chính đều có biến thể `light*` (nền nhạt, badge/alert) và `dark*` (hover/pressed) — xem đủ trong `src/theme/LightTheme.ts` / `DarkTheme.ts`. Có 8 theme màu khác (`LightTheme1..8`, `DarkTheme1..8`) đã định nghĩa sẵn trong cùng file nếu cần đổi tông màu thương hiệu — đổi qua `useCustomizerStore().SET_THEME(name)`, không hardcode màu mới.

### Typography (`src/scss/_variables.scss`)
- Font mặc định: `Inter var` (đã load `@fontsource/inter`); có sẵn Roboto/Poppins/Public Sans nếu đổi `fontTheme` trong customizer store.
- Scale: h1 `2.375rem/600`, h2 `1.875rem/600`, h3 `1.5rem/600`, h4 `1.25rem/600`, h5 `1rem/600`, h6 `0.875rem/400`, subtitle-1 `0.875rem/600`, subtitle-2 `0.75rem/500`, body-1 `0.875rem/400`, body-2 `0.75rem/400`, button `0.875rem/500` (capitalize), caption `0.75rem/400`.

### Bo góc, khoảng cách, đổ bóng
- `border-radius-root: 8px` → scale: `sm=4px`, mặc định=`8px`, `md=8px`, `lg=12px`, `xl=48px`, `pill=9999px`.
- Default component overrides (`src/plugins/vuetify.ts`): `VCard` → `rounded: 'md'`, `VTextField` → `rounded: 'lg'`, `VTooltip` → `location: 'top'`.
- `card-item-spacer-xy: 24px`, `card-text-spacer: 24px`.
- Card shadow chuẩn: `0px 8px 24px rgba(19, 25, 32, 0.08)` (light), dark theme dùng shadow đậm hơn — xem `variables['card-shadow']` theo từng theme.
- Icon set: MDI (`vuetify/iconsets/mdi-svg` + `vue-tabler-icons`) — không nhúng icon set khác.

## Layout & component quy ước
- Trang cần đăng nhập → bọc trong `DashboardLayout.vue` (`src/layouts/dashboard/`): sidebar dọc (`vertical-sidebar/`) hoặc ngang (`horizontal-sidebar/`), `VerticalHeader`/`HorizontalHeader`, `FooterPanel`, `CustomizerPanel`.
- Trang auth (login, forgot-password) → bọc trong `BlankLayout.vue` (`src/layouts/blank/`), giao diện tối giản, không sidebar.
- Bảng dữ liệu (danh sách Media, Post...) → dùng `EasyDataTable` (đã global-register trong `main.ts`), phân trang bằng `PaginationCommon` — không tự viết bảng HTML từ đầu.
- Bọc nội dung 1 khối trong card chuẩn → `UiParentCard` (`src/components/shared/UiParentCard.vue`).
- Breadcrumb đầu trang → `BaseBreadcrumb`, nhận `BreadcrumbType[]` (`src/types/common/index.ts`).
- Chọn ngày/giờ → component `DatePicker` (wrap `@vuepic/vue-datepicker`), không import thư viện date picker khác.
- Icon lẻ trong UI → `SvgSprite` hoặc tabler icon component, không nhúng SVG rời rạc.

## Khi phác thảo bằng `/design`
- Dùng palette ở trên làm màu chủ đạo cho artboard — **không** dùng palette brand-neutral mặc định của skill `dataviz`/`artifact-design`.
- Mô phỏng đúng bố cục: sidebar trái + header trên + content area dạng card bo góc `md`, đúng như `DashboardLayout` thật, nếu là màn quản trị nội bộ (danh sách/sửa Media, Post, Cast, Genre).
- Font ưu tiên Inter; heading đậm 600, body 400, giữ đúng scale kích thước ở trên để khi implement lại không bị lệch.

## Khi implement trực tiếp bằng Vue
- Lấy màu qua class Vuetify chuẩn (`text-primary`, `bg-primary`, `text-error`...) hoặc CSS var `var(--v-theme-primary)` — **không hardcode mã hex** trong component `.vue`.
- SCSS bổ sung cho 1 component đặt tại `src/scss/components/_<TenComponent>.scss`, cho 1 trang đặt tại `src/scss/pages/_<page>.scss`, rồi thêm dòng `@import` tương ứng vào `src/scss/style.scss` (theo đúng thứ tự nhóm layout → components → pages đã có).
- Ưu tiên component Vuetify có sẵn (`VCard`, `VDataTable`/`EasyDataTable`, `VTextField`, `VBtn`...) hơn là tự viết HTML/CSS thô.
