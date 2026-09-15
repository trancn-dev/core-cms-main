<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const breadcrumbs: BreadcrumbType[] = [{ title: 'Playlist', href: '/playlists' }, { title: 'Chi tiết', disabled: true }];

const playlist = ref({ id: route.params.id, title: 'Vue 3 Series', owner: 'Nguyễn Văn An', visibility: 'public', createdAt: '10/07/2026' });

const videos = ref([
  { id: 1, order: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', duration: '1:24:00', channel: 'Dev Việt Nam' },
  { id: 2, order: 2, title: 'Pinia — Quản lý state trong Vue', duration: '38:45', channel: 'Dev Việt Nam' },
  { id: 3, order: 3, title: 'Vue Router 4 Nâng cao', duration: '50:20', channel: 'Dev Việt Nam' },
  { id: 4, order: 4, title: 'Vuetify 3 — UI Components', duration: '45:00', channel: 'Frontend Studio' }
]);

const visColor: Record<string, string> = { public: 'success', private: 'error', unlisted: 'warning' };
const visLabel: Record<string, string> = { public: 'Công khai', private: 'Riêng tư', unlisted: 'Không danh sách' };

function removeVideo(id: number) {
  videos.value = videos.value.filter(v => v.id !== id).map((v, i) => ({ ...v, order: i + 1 }));
}
</script>

<template>
  <BaseBreadcrumb :title="playlist.title" :breadcrumbs="breadcrumbs" />
  <v-row class="mt-4">
    <v-col cols="12" md="4">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text class="pa-4">
          <h3 class="text-h6 font-weight-bold mb-2">{{ playlist.title }}</h3>
          <div class="d-flex gap-2 mb-3">
            <v-chip :color="visColor[playlist.visibility]" size="x-small" variant="tonal">{{ visLabel[playlist.visibility] }}</v-chip>
          </div>
          <div class="text-body-2 text-medium-emphasis mb-1">Chủ sở hữu: <span class="text-high-emphasis">{{ playlist.owner }}</span></div>
          <div class="text-body-2 text-medium-emphasis mb-1">Ngày tạo: {{ playlist.createdAt }}</div>
          <div class="text-body-2 text-medium-emphasis">Số video: {{ videos.length }}</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Danh sách video trong playlist</v-card-title>
        <v-divider />
        <v-list lines="one">
          <v-list-item v-for="v in videos" :key="v.id">
            <template #prepend>
              <div class="text-h6 text-medium-emphasis mr-3" style="min-width:24px">{{ v.order }}</div>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">
              <router-link :to="`/videos/\${v.id}`" class="text-primary text-decoration-none">{{ v.title }}</router-link>
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ v.channel }} · {{ v.duration }}</v-list-item-subtitle>
            <template #append>
              <v-btn icon size="x-small" variant="text" color="error" @click="removeVideo(v.id)"><v-icon>mdi-close</v-icon></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
