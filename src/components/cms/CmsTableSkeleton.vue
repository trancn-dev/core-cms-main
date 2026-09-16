<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Must match the real table's column count so the skeleton lines up. */
    columns: number;
    rows?: number;
    /** Index of the column that holds a thumbnail + title. */
    thumbColumn?: number;
    /** Index of the column that holds a status chip. */
    chipColumn?: number;
  }>(),
  { rows: 5 }
);
</script>

<template>
  <tbody>
    <tr v-for="r in rows" :key="r" style="cursor: default">
      <td v-for="c in columns" :key="c">
        <div v-if="c - 1 === thumbColumn" class="d-flex align-center ga-3">
          <div class="cms-skeleton cms-skeleton--thumb cms-skeleton--shimmer"></div>
          <div class="cms-skeleton flex-grow-1"></div>
        </div>
        <div v-else-if="c - 1 === chipColumn" class="cms-skeleton cms-skeleton--chip"></div>
        <div v-else class="cms-skeleton"></div>
      </td>
    </tr>
  </tbody>
</template>
