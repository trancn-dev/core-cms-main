# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Về dự án

CMS quản lý kho media (ảnh/video) làm nguồn tham chiếu cho các trang khác. Dự án cá nhân, làm mới hoàn toàn (không kế thừa hệ thống cũ), tốc độ phát triển thong thả, không cần tối ưu cho quy mô lớn ở giai đoạn này.

**Mô hình dữ liệu cốt lõi**:
- **Media**: thực thể lưu file gốc — title, thời lượng (duration), type (image/video), phân loại theo Cast (diễn viên) và Genre (phim, hài, kịch...).
- **Post**: thực thể nội dung riêng, tham chiếu tới một `media_id` cụ thể, có cast riêng của nó. Nhiều Post có thể dùng chung một Media.

**Vai trò & quyền**: hiện tại chỉ làm role `admin` (toàn quyền, xem được nhiều trang hơn). Role `editor` (quyền giới hạn) để sau — **chưa cần** làm workflow duyệt nội dung (draft/review/publish) ở giai đoạn này; admin thao tác trực tiếp.

**Backend**: chưa xây dựng — dự kiến Laravel 12/13, CMS (frontend này) gọi REST API của Laravel. Chưa có schema DB. Dùng **một bộ API duy nhất** (không tách public API riêng cho site ngoài và admin API riêng cho CMS) — phân quyền qua token/role.

**Lưu trữ media**: tạm thời load từ ổ đĩa local (vd: ổ D máy dev); dự kiến chuyển sang MinIO sau nhưng MinIO **chưa setup**. Không thiết kế cứng theo một provider cụ thể nếu tránh được, vì sẽ đổi sang MinIO.

**Auth**: chỉ cần đăng nhập (authenticate) hoạt động được là đủ — **chưa cần 2FA**, chưa cần tích hợp bên thứ ba nào khác ở giai đoạn này.

**Đa ngôn ngữ**: tiếng Việt (chính) và tiếng Anh. Các locale `fr`/`ro`/`zh` có sẵn trong `src/utils/locales/` là di sản từ template gốc, không phải yêu cầu thật của dự án — không cần duy trì đầy đủ bản dịch cho chúng.

**Giao diện**: chưa có thiết kế chính thức. Codebase này được **mua lại** làm nền tảng (Able Pro Vuetify Vue admin template) — **ưu tiên tái sử dụng/mở rộng component, layout, theme có sẵn thay vì viết lại từ đầu**. Thiết kế UI cụ thể sẽ được bổ sung sau (khách hàng tự thiết kế hoặc phối hợp qua Claude Design).

**Triển khai**: hiện tại chỉ chạy Docker dev (xem `Dockerfile.dev`, `docker-compose.yml`) — chưa cần cấu hình deploy production.

## Commands

```bash
npm run dev            # Start Vite dev server
npm run build           # Type-check (vue-tsc) then production build
npm run build-stage     # Build with base=/vue/stage/
npm run build-prod      # Build with base=/vue/
npm run preview         # Preview production build on port 5050
npm run typecheck       # vue-tsc --noEmit (no build)
npm run lint             # ESLint with --fix over .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts
```

There is no test suite/framework configured in this repo currently.

Note: there are two ESLint configs present — legacy `.eslintrc.cjs` (extends `plugin:vue/vue3-essential`, `@vue/eslint-config-typescript`, prettier) and a flat `eslint.config.js` (ESLint 9 style). The `lint` script relies on the legacy `.eslintrc.cjs` resolution; be aware both exist if you touch lint config.

### Docker (dev environment)

No native Node.js is installed on this machine — the project runs via Docker for local development:

```bash
docker compose up -d --build   # build & start dev container (Vite on :5173, hot-reload via volume mount)
docker compose logs -f app     # follow dev server logs
docker compose exec app bash   # shell into the container
docker compose down            # stop & remove the container
```

`VITE_BASE_API` is read from the environment (defaults to `http://localhost:3000` in `docker-compose.yml`) — override via a `.env` file (not checked in) once the Laravel backend exists.

## Architecture

- **Entry point**: `src/main.ts` registers global plugins (Pinia w/ `pinia-plugin-persistedstate`, vue-router, vue-i18n, Vuetify, PerfectScrollbar, VueTablerIcons, vue-toast-notification, vue3-easy-data-table) and globally registers a handful of shared components (`EasyDataTable`, `DatePicker`, `PaginationCommon`, `SvgSprite`, `BaseBreadcrumb`) so they're usable without per-file imports.
- **Path alias**: `@` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
- **Routing** (`src/router/`): `index.ts` assembles the router from `MainRoutes.ts` (authenticated app routes, wrapped in `DashboardLayout.vue`, `meta.requiresAuth: true`) and `AuthRoutes.ts` (login/forgot-password, wrapped in `BlankLayout.vue`, `meta.requiresAuth: false`), plus top-level 404/403 pages. Global navigation guards exist as hook points (`router.beforeEach`/`afterEach` toggle `useUIStore().isLoading`) but the actual auth-check logic is not yet implemented — look for `// Logic` placeholder comments before assuming auth guarding is enforced.
- **Layouts** (`src/layouts/`): `dashboard/` contains the main app chrome — both vertical and horizontal sidebar variants (`vertical-sidebar/`, `horizontal-sidebar/`), plus header, footer, and customizer panel components. `blank/` is the minimal layout used for auth pages.
- **State** (`src/stores/`, Pinia): `ui.ts` (global loading flag, setup-store style), `customizer.ts` (theme/layout UI prefs, seeded from `src/config.ts`, options-store style), `auth.ts` (currently an empty stub — auth state/actions not yet implemented). Note the mix of Pinia's options-API style (`defineStore({...})`) and composition-API style (`defineStore('id', () => {...})`) across stores.
- **API layer** (`src/apis/`): `core.ts` exports a singleton `requestMethods` (an axios wrapper class `RequestMethods`) configured with `baseURL: import.meta.env.VITE_BASE_API` (no `.env` file is checked in — must be supplied per environment). Request/response interceptors are stub hooks (e.g. 401 handling in the response interceptor is a `// Logic` placeholder). All responses are typed via `ApiResponseType<T>` / `ApiGetItemsResponse<T>` from `src/types/common/index.ts`. HTTP status constants live in `src/utils/consts.ts`.
- **i18n**: `vue-i18n` configured in `main.ts`, locale JSON files under `src/utils/locales/` (`en`, `fr`, `ro`, `zh`), aggregated via `src/utils/locales/messages.ts`.
- **Theming**: Vuetify setup in `src/plugins/vuetify.ts`, theme type definitions in `src/types/themeTypes/`, global SCSS in `src/scss/` (split into `components/`, `layout/`, `pages/`).
- **Shared components** (`src/components/shared/`): generic building blocks used across pages/layouts (breadcrumb, date picker, pagination, SVG sprite icon loader, parent card wrapper) — most are globally registered in `main.ts`.
