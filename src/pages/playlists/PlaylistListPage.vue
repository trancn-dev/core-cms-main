<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Playlist', disabled: true }];
const search = ref('');

const playlists = ref([
  { id: 1, title: 'Vue 3 Series', owner: 'Nguyễn Văn An', videos: 12, visibility: 'public', createdAt: '10/07/2026' },
  { id: 2, title: 'DevOps Roadmap', owner: 'Phạm Văn Hùng', videos: 8, visibility: 'public', createdAt: '20/07/2026' },
  { id: 3, title: 'Database Mastery', owner: 'Hoàng Thị Mai', videos: 6, visibility: 'private', createdAt: '01/08/2026' },
  { id: 4, title: 'Frontend Skills', owner: 'Lê Thị Hoa', videos: 15, visibility: 'unlisted', createdAt: '10/08/2026' },
  { id: 5, title: 'Bookmark Yêu thích', owner: 'Trần Minh Đức', videos: 24, visibility: 'private', createdAt: '15/08/2026' }
]);

const visColor: Record<string, string> = { public: 'success', private: 'error', unlisted: 'warning' };
const visLabel: Record<string, string> = { public: 'Công khai', private: 'Riêng tư', unlisted: 'Không danh sách' };
</script>

<template>
  <BaseBreadcrumb title="Quản lý Playlist" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm playlist..." variant="outlined" density="compact" hide-details single-line class="mb-4" style="max-width:400px" />
      <v-table density="compact">
        <thead>
          <tr><th>Tên playlist</th><th>Chủ sở hữu</th><th class="text-right">Số video</th><th>Quyền truy cập</th><th>Ngày tạo</th><th style="width:80px"></th></tr>
        </thead>
        <tbody>
          <tr v-for="p in playlists.filter(x => !search || x.title.toLowerCase().includes(search.toLowerCase()) || x.owner.toLowerCase().includes(search.toLowerCase()))" :key="p.id">
            <td><router-link :to="`/playlists/\${p.id}`" class="text-primary text-decoration-none text-body-2 font-weight-medium">{{ p.title }}</router-link></td>
            <td class="text-body-2 text-medium-emphasis">{{ p.owner }}</td>
            <td class="text-right text-body-2">{{ p.videos }}</td>
            <td><v-chip :color="visColor[p.visibility]" size="x-small" variant="tonal">{{ visLabel[p.visibility] }}</v-chip></td>
            <td class="text-body-2 text-medium-emphasis">{{ p.createdAt }}</td>
            <td>
              <v-btn icon size="x-small" variant="text" :to="`/playlists/\${p.id}`"><v-icon>mdi-eye</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" color="error" @click="playlists = playlists.filter(x => x.id !== p.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
