<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsInfoRow from '@/components/cms/CmsInfoRow.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { PlaylistVisibility } from '@/types/media';

const route = useRoute();
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Playlist', href: '/playlists' },
  { title: 'Chi tiết', disabled: true }
];

const playlist = ref({
  id: route.params.id,
  title: 'Vue 3 Series',
  owner: 'Nguyễn Văn An',
  visibility: 'public' as PlaylistVisibility,
  createdAt: '10/07/2026'
});

type Row = { id: number; order: number; title: string; duration: string; channel: string };

const videos = ref<Row[]>([
  { id: 1, order: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', duration: '1:24:00', channel: 'Dev Việt Nam' },
  { id: 2, order: 2, title: 'Pinia — Quản lý state trong Vue', duration: '38:45', channel: 'Dev Việt Nam' },
  { id: 3, order: 3, title: 'Vue Router 4 nâng cao', duration: '50:20', channel: 'Dev Việt Nam' },
  { id: 4, order: 4, title: 'Vuetify 3 — UI Components', duration: '45:00', channel: 'Frontend Studio' }
]);

const removeDialog = ref(false);
const pending = ref<Row | null>(null);

function askRemove(row: Row) {
  pending.value = row;
  removeDialog.value = true;
}

function confirmRemove() {
  videos.value = videos.value.filter((v) => v.id !== pending.value?.id).map((v, i) => ({ ...v, order: i + 1 }));
  removeDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb :title="playlist.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12" md="4">
      <CmsFormCard title="Thông tin playlist">
        <div>
          <CmsInfoRow label="Quyền truy cập"><CmsStatusChip type="playlist" :value="playlist.visibility" /></CmsInfoRow>
          <CmsInfoRow label="Chủ sở hữu" :value="playlist.owner" />
          <CmsInfoRow label="Ngày tạo" :value="playlist.createdAt" />
          <CmsInfoRow label="Số video" :value="videos.length" />
        </div>
      </CmsFormCard>
    </v-col>

    <v-col cols="12" md="8">
      <CmsTableCard :columns="5" :count="videos.length" empty-title="Playlist chưa có video nào">
        <template #head>
          <tr>
            <th style="width: 48px" class="cms-num">#</th>
            <th>Tiêu đề</th>
            <th style="width: 150px">Kênh</th>
            <th style="width: 96px" class="cms-num">Thời lượng</th>
            <th style="width: 60px"></th>
          </tr>
        </template>
        <template #body>
          <tr v-for="v in videos" :key="v.id">
            <td class="cms-num text-lightText">{{ v.order }}</td>
            <td><router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link></td>
            <td class="text-lightText">{{ v.channel }}</td>
            <td class="cms-num text-lightText">{{ v.duration }}</td>
            <td class="text-right">
              <v-tooltip text="Gỡ khỏi playlist">
                <template #activator="{ props: tip }">
                  <v-btn
                    v-bind="tip"
                    class="cms-icon-btn cms-icon-btn--danger"
                    variant="flat"
                    size="small"
                    aria-label="Gỡ khỏi playlist"
                    @click.stop="askRemove(v)"
                  >
                    <v-icon size="17">mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </CmsTableCard>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="removeDialog"
    title="Gỡ khỏi playlist"
    confirm-label="Gỡ"
    icon="mdi-close"
    :message="`Gỡ “${pending?.title}” khỏi playlist? Video vẫn còn trong thư viện.`"
    @confirm="confirmRemove"
  />
</template>
