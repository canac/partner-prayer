<template>
  <PartnerList />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PartnerList from './components/PartnerList.vue';

@Options({
  components: {
    PartnerList,
  },
})
export default class App extends Vue {};
</script>
