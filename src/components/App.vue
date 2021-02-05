<template>
  <PartnerSchedule />
</template>

<script lang="ts">
import PartnerSchedule from './PartnerSchedule.vue';
import { provide } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: import.meta.env.SNOWPACK_PUBLIC_API_BASE,
});
const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default {
  components: { PartnerSchedule },

  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
};
</script>
