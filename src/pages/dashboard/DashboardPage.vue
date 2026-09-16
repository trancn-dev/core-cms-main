<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CmsStatCard from '@/components/cms/CmsStatCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsLineChart from '@/components/cms/CmsLineChart.vue';
import CmsDonutChart from '@/components/cms/CmsDonutChart.vue';
import { dashboardService } from '@/apis/media';
import type { DashboardStats } from '@/types/media';
import { TONE_COLORS, type StatusTone } from '@/utils/statusMaps';

/*
 * Answers three questions in order: what needs handling today, how content
 * is performing, whether the system is healthy (artboard 06).
 */
const loading = ref(true);
const error = ref<string | null>(null);
const stats = ref<DashboardStats | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    stats.value = await dashboardService.getStats();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Không tải được số liệu.';
  } finally {
    loading.value = false;
  }
}

onMounted(load);

const fmt = (n: number) => n.toLocaleString('vi-VN');
const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;

const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

// ─── Range ──────────────────────────────────────────────────────────────────
const ranges = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 90, label: '90 ngày' }
];
const range = ref(30);

// Mock series until the analytics endpoint exists — deterministic so it
// does not jump on every render.
function series(days: number, base: number, seed: number) {
  return Array.from({ length: days }, (_, i) => Math.round(base + i * (base / days) * 0.6 + Math.sin(i * 0.9 + seed) * base * 0.12));
}

const chartLabels = computed(() =>
  Array.from({ length: range.value }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (range.value - 1 - i));
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  })
);
const chartCurrent = computed(() => series(range.value, 72000, 1));
const chartPrevious = computed(() => series(range.value, 64000, 2.5));

// ─── KPIs ───────────────────────────────────────────────────────────────────
const kpis = computed(() => {
  const s = stats.value;
  return [
    { icon: 'mdi-eye', label: 'Tổng lượt xem', value: s ? fmt(s.totalViews) : '—', delta: s ? pct(s.viewsGrowth) : '', direction: 'up' as const, note: `so với ${range.value} ngày trước`, tone: 'primary' as StatusTone },
    { icon: 'mdi-movie-outline', label: 'Video', value: s ? fmt(s.totalVideos) : '—', note: 'trong thư viện', tone: 'success' as StatusTone },
    { icon: 'mdi-account-plus-outline', label: 'Người dùng mới hôm nay', value: s ? fmt(s.newUsersToday) : '—', delta: s ? pct(s.usersGrowth) : '', direction: 'up' as const, note: 'so với hôm qua', tone: 'info' as StatusTone },
    { icon: 'mdi-flag-outline', label: 'Báo cáo chờ xử lý', value: s ? fmt(s.pendingReports) : '—', note: 'cần kiểm duyệt', tone: 'warning' as StatusTone }
  ];
});

const queue: { icon: string; label: string; count: number; note: string; tone: StatusTone; to: string }[] = [
  { icon: 'mdi-comment-outline', label: 'Bình luận chờ duyệt', count: 142, note: 'cũ nhất 6 giờ trước', tone: 'warning', to: '/comments' },
  { icon: 'mdi-flag-outline', label: 'Báo cáo vi phạm', count: 37, note: '5 báo cáo bản quyền', tone: 'error', to: '/reports' },
  { icon: 'mdi-movie-outline', label: 'Video đang xử lý', count: 6, note: 'dự kiến xong trong 18 phút', tone: 'info', to: '/videos' },
  { icon: 'mdi-account-box-outline', label: 'Kênh chờ xác thực', count: 4, note: 'nộp hồ sơ tuần này', tone: 'grey', to: '/channels' }
];

const sources = [
  { label: 'Trực tiếp', value: 55, color: 'primary' },
  { label: 'Đề xuất', value: 30, color: 'info' },
  { label: 'Tìm kiếm', value: 15, color: 'warning' }
];

const system = [
  { label: 'Dung lượng lưu trữ', value: '4,2 / 8 TB', pct: 53, color: 'primary' },
  { label: 'Hàng đợi xử lý video', value: '6 / 20 slot', pct: 30, color: 'warning' },
  { label: 'Băng thông tháng này', value: '18,6 / 25 TB', pct: 74, color: 'success' }
];

const activity: { icon: string; text: string; meta: string; time: string; tone: StatusTone }[] = [
  { icon: 'mdi-cloud-upload-outline', text: 'Nguyễn An đã tải lên “CI/CD với GitHub Actions”', meta: 'Kênh DevOps VN · chờ xử lý', time: '8 phút trước', tone: 'primary' },
  { icon: 'mdi-check-circle', text: 'Trần Mai đã duyệt 24 bình luận', meta: 'Video “Hướng dẫn Vue 3 từ A đến Z”', time: '32 phút trước', tone: 'success' },
  { icon: 'mdi-flag-outline', text: 'Báo cáo bản quyền mới từ 3 người dùng', meta: 'Video “Học TypeScript trong 1 giờ”', time: '1 giờ trước', tone: 'error' },
  { icon: 'mdi-cancel', text: 'Lê Quân đã khoá video vi phạm', meta: 'Video “Phim tổng hợp 2026”', time: '3 giờ trước', tone: 'warning' },
  { icon: 'mdi-check-decagram', text: 'Kênh “Frontend Studio” được xác thực', meta: 'Duyệt bởi Admin', time: 'Hôm qua · 17:20', tone: 'info' }
];

const toneClass = (tone: StatusTone) => [`bg-${TONE_COLORS[tone].bg}`, `text-${TONE_COLORS[tone].fg}`];
</script>

<template>
  <div class="cms-page-header mb-4">
    <div>
      <h2 class="text-h2 mb-0">Xin chào, Admin</h2>
      <div class="text-body-1 text-lightText text-capitalize-first">{{ today }}</div>
    </div>
    <v-btn-toggle v-model="range" mandatory class="cms-segmented" style="width: auto" variant="text">
      <v-btn v-for="r in ranges" :key="r.value" :value="r.value" style="min-width: 76px">{{ r.label }}</v-btn>
    </v-btn-toggle>
  </div>

  <v-alert v-if="error" type="error" variant="tonal" class="mb-4" :text="error">
    <template #append>
      <v-btn size="small" variant="text" @click="load">Thử lại</v-btn>
    </template>
  </v-alert>

  <!-- KPIs -->
  <v-row>
    <v-col v-for="k in kpis" :key="k.label" cols="12" sm="6" lg="3">
      <v-skeleton-loader v-if="loading" type="card" height="132" class="rounded-lg" />
      <CmsStatCard v-else v-bind="k" />
    </v-col>
  </v-row>

  <!-- Trend + what needs handling -->
  <v-row>
    <v-col cols="12" lg="8">
      <v-card variant="outlined" rounded="lg" elevation="0" height="100%">
        <v-card-text>
          <div class="text-h5">Lượt xem theo ngày</div>
          <div class="text-caption text-lightText">{{ range }} ngày gần nhất</div>
          <CmsLineChart :labels="chartLabels" :current="chartCurrent" :previous="chartPrevious" />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4">
      <v-card variant="outlined" rounded="lg" elevation="0" height="100%">
        <v-card-text class="d-flex flex-column ga-3">
          <div class="text-h5">Cần xử lý</div>
          <router-link
            v-for="q in queue"
            :key="q.label"
            :to="q.to"
            class="d-flex align-center ga-3 pb-3 border-b-thin text-decoration-none text-darkText"
          >
            <div class="cms-stat__icon" style="width: 32px; height: 32px" :class="toneClass(q.tone)">
              <v-icon size="18">{{ q.icon }}</v-icon>
            </div>
            <div class="flex-grow-1" style="min-width: 0">
              <div class="text-subtitle-1">{{ q.label }}</div>
              <div class="text-caption text-lightText">{{ q.note }}</div>
            </div>
            <span class="text-h4" style="font-variant-numeric: tabular-nums">{{ fmt(q.count) }}</span>
          </router-link>
          <v-btn variant="text" color="primary" size="small" class="align-self-start" to="/comments">
            Mở hàng đợi kiểm duyệt →
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Content performance + system -->
  <v-row>
    <v-col cols="12" lg="8">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h5">Video xem nhiều nhất</span>
        <v-btn variant="text" color="primary" size="small" to="/videos">Xem tất cả →</v-btn>
      </div>
      <CmsTableCard
        :columns="5"
        :loading="loading"
        :count="stats?.topVideos.length ?? 0"
        :chip-column="4"
        empty-title="Chưa có dữ liệu"
        empty-description="Số liệu sẽ xuất hiện khi video có lượt xem."
      >
        <template #head>
          <tr>
            <th style="width: 44px">#</th>
            <th>Tiêu đề</th>
            <th style="width: 150px">Kênh</th>
            <th style="width: 110px" class="cms-num">Lượt xem</th>
            <th style="width: 130px">Trạng thái</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="(v, i) in stats?.topVideos" :key="v.id">
            <td class="text-lightText font-weight-medium">{{ i + 1 }}</td>
            <td><router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link></td>
            <td class="text-lightText text-truncate" style="max-width: 150px">{{ v.channel?.name }}</td>
            <td class="cms-num">{{ fmt(v.viewsCount) }}</td>
            <td><CmsStatusChip type="video" :value="v.status" /></td>
          </tr>
        </template>
      </CmsTableCard>
    </v-col>

    <v-col cols="12" lg="4" class="d-flex flex-column ga-5">
      <v-card variant="outlined" rounded="lg" elevation="0">
        <v-card-text class="d-flex flex-column ga-3">
          <div class="text-h5">Nguồn lượt xem</div>
          <CmsDonutChart :segments="sources" />
        </v-card-text>
      </v-card>

      <v-card variant="outlined" rounded="lg" elevation="0">
        <v-card-text class="d-flex flex-column ga-3">
          <div class="text-h5">Hệ thống</div>
          <div v-for="s in system" :key="s.label" class="d-flex flex-column ga-2">
            <div class="d-flex justify-space-between text-caption">
              <span class="text-lightText">{{ s.label }}</span>
              <b>{{ s.value }}</b>
            </div>
            <v-progress-linear :model-value="s.pct" :color="s.color" bg-color="gray100" bg-opacity="1" height="6" rounded />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Activity -->
  <v-card variant="outlined" rounded="lg" elevation="0" class="mt-2">
    <v-card-text class="d-flex flex-column ga-3">
      <div class="text-h5">Hoạt động gần đây</div>
      <div v-for="a in activity" :key="a.text" class="d-flex align-start ga-3 pb-3 border-b-thin">
        <div class="cms-stat__icon" style="width: 28px; height: 28px" :class="toneClass(a.tone)">
          <v-icon size="16">{{ a.icon }}</v-icon>
        </div>
        <div class="flex-grow-1" style="min-width: 0">
          <div class="text-body-1">{{ a.text }}</div>
          <div class="text-caption text-lightText">{{ a.meta }}</div>
        </div>
        <span class="text-caption text-lightText text-no-wrap">{{ a.time }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-capitalize-first::first-letter {
  text-transform: uppercase;
}
</style>
