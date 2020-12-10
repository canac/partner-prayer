<template>
  <div class="partner-list">
    <p v-for="partner in partners" :key="partner">
      {{ partner }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class PartnerList extends Vue {
  readonly partners: string[] = ['Alice', 'Bob', 'Charlie'];
};
</script>
