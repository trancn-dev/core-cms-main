<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Kênh', disabled: true }];
const search = ref('');
const filterStatus = ref('');

const channels = ref([
  { id: 1, name: 'Dev Việt Nam', slug: 'dev-viet-nam', owner: 'Nguyễn Văn An', videos: 84, subscribers: 128400, status: 'active', verified: true },
  { id: 2, name: 'Code Pro', slug: 'code-pro', owner: 'Trần Minh Đức', videos: 62, subscribers: 97200, status: 'active', verified: true },
  { id: 3, name: 'Frontend Studio', slug: 'frontend-studio', owner: 'Lê Thị Hoa', videos: 45, subscribers: 54800, status: 'active', verified: false },
  { id: 4, name: 'DevOps VN', slug: 'devops-vn', owner: 'Phạm Văn Hùng', videos: 38, subscribers: 41200, status: 'active', verified: true },
  { id: 5, name: 'DB Master', slug: 'db-master', owner: 'Hoàng Thị Mai', videos: 29, subscribers: 28600, status: 'suspended', verified: false }
]);

const filtered = computed(() => channels.value.filter(c =>
  (!search.value || c.name.toLowerCase().includes(search.value.toLowerCase())) &&
  (!filterStatus.value || c.status === filterStatus.value)
));

const statusColor: Record<string, string> = { active: 'success', suspended: 'error', inactive: 'grey' };
const statusLabel: Record<string, string> = { active: 'Hoạt động', suspended: 'Đình chỉ', inactive: 'Ẩn' };
function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb title="Danh sách kênh" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="5">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm kênh..." variant="outlined" density="compact" hide-details single-line />
        </v-col>
        <v-col cols="6" sm="3">
          <v-select v-model="filterStatus" :items="[{title:'Tất cả',value:''},{title:'Hoạt động',value:'active'},{title:'Đình chỉ',value:'suspended'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" prepend-icon="mdi-plus" size="small" to="/channels/create">Thêm kênh</v-btn>
        </v-col>
      </v-row>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Kênh</th><th>Chủ kênh</th>
            <th class="text-right">Video</th><th class="text-right">Subscribers</th>
            <th>Trạng thái</th><th style="width:110px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ch in filtered" :key="ch.id">
            <td>
              <div class="d-flex align-center gap-2">
                <v-avatar color="primary" size="32" rounded="lg">{{ ch.name[0] }}</v-avatar>
                <div>
                  <router-link :to="`/channels/\${ch.id}`" class="text-primary text-decoration-none text-body-2 font-weight-medium">{{ ch.name }}</router-link>
                  <v-icon v-if="ch.verified" size="14" color="info" class="ml-1">mdi-check-decagram</v-icon>
                  <div class="text-caption text-medium-emphasis">/{{ ch.slug }}</div>
                </div>
              </div>
            </td>
            <td class="text-body-2">{{ ch.owner }}</td>
            <td class="text-right text-body-2">{{ ch.videos }}</td>
            <td class="text-right text-body-2">{{ fmt(ch.subscribers) }}</td>
            <td><v-chip :color="statusColor[ch.status]" size="x-small" variant="tonal">{{ statusLabel[ch.status] }}</v-chip></td>
            <td>
              <v-btn icon size="x-small" variant="text" :to="`/channels/\${ch.id}`"><v-icon>mdi-eye</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" :to="`/channels/\${ch.id}/edit`"><v-icon>mdi-pencil</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
