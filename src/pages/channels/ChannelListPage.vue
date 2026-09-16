<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { ChannelStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Kênh', disabled: true }];
const search = ref('');
const filterStatus = ref<ChannelStatus | ''>('');
const statusOpts = statusFilterOptions('channel', 'Tất cả trạng thái');

const channels = ref<
  { id: number; name: string; slug: string; owner: string; videos: number; subscribers: number; status: ChannelStatus; verified: boolean }[]
>([
  { id: 1, name: 'Dev Việt Nam', slug: 'dev-viet-nam', owner: 'Nguyễn Văn An', videos: 84, subscribers: 128400, status: 'active', verified: true },
  { id: 2, name: 'Code Pro', slug: 'code-pro', owner: 'Trần Minh Đức', videos: 62, subscribers: 97200, status: 'active', verified: true },
  { id: 3, name: 'Frontend Studio', slug: 'frontend-studio', owner: 'Lê Thị Hoa', videos: 45, subscribers: 54800, status: 'active', verified: false },
  { id: 4, name: 'DevOps VN', slug: 'devops-vn', owner: 'Phạm Văn Hùng', videos: 38, subscribers: 41200, status: 'active', verified: true },
  { id: 5, name: 'DB Master', slug: 'db-master', owner: 'Hoàng Thị Mai', videos: 29, subscribers: 28600, status: 'suspended', verified: false }
]);

const filtered = computed(() =>
  channels.value.filter(
    (c) =>
      (!search.value || c.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (!filterStatus.value || c.status === filterStatus.value)
  )
);

function fmt(n: number) {
  return n.toLocaleString('vi-VN');
}
</script>

<template>
  <BaseBreadcrumb title="Danh sách kênh" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="6"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="kênh"
    empty-title="Không tìm thấy kênh nào"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kênh…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <v-select
        v-model="filterStatus"
        :items="statusOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
      <div class="cms-toolbar__spacer"></div>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/channels/create">Thêm kênh</v-btn>
    </template>

    <template #head>
      <tr>
        <th>Kênh</th>
        <th style="width: 180px">Chủ kênh</th>
        <th style="width: 96px" class="cms-num">Video</th>
        <th style="width: 120px" class="cms-num">Người đăng ký</th>
        <th style="width: 140px">Trạng thái</th>
        <th style="width: 140px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="ch in filtered" :key="ch.id">
        <td>
          <div class="d-flex align-center ga-3" style="min-width: 0">
            <v-avatar color="lightprimary" size="32" rounded="md">
              <span class="text-onLightprimary font-weight-bold">{{ ch.name[0] }}</span>
            </v-avatar>
            <div style="min-width: 0">
              <div class="d-flex align-center ga-1">
                <router-link :to="`/channels/${ch.id}`" class="cms-table__title">{{ ch.name }}</router-link>
                <v-tooltip v-if="ch.verified" text="Kênh đã xác thực">
                  <template #activator="{ props: tip }">
                    <v-icon v-bind="tip" size="14" color="info">mdi-check-decagram</v-icon>
                  </template>
                </v-tooltip>
              </div>
              <div class="cms-table__sub">/{{ ch.slug }}</div>
            </div>
          </div>
        </td>
        <td>{{ ch.owner }}</td>
        <td class="cms-num">{{ fmt(ch.videos) }}</td>
        <td class="cms-num">{{ fmt(ch.subscribers) }}</td>
        <td><CmsStatusChip type="channel" :value="ch.status" /></td>
        <td class="cms-table__actions">
          <CmsRowActions :view-to="`/channels/${ch.id}`" :edit-to="`/channels/${ch.id}/edit`" :deletable="false" />
        </td>
      </tr>
    </template>
  </CmsTableCard>
</template>
