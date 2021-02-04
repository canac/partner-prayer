<template>
  <PartnerSchedule />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PartnerSchedule from './components/PartnerSchedule.vue';

@Options({
  components: {
    PartnerSchedule,
  },
})
export default class App extends Vue {};
</script>
