<template>
  <PartnerSchedule />
</template>

<script lang="ts">
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { defineComponent, provide } from 'vue';
import PartnerSchedule from './PartnerSchedule.vue';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: import.meta.env.SNOWPACK_PUBLIC_API_BASE as string,
});
const cache = new InMemoryCache({
  typePolicies: {
    ScheduleDay: {
      fields: {
        partners: {
          merge: false,
        },
      },
    },
  },
});
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default defineComponent({
  components: { PartnerSchedule },

  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
});
</script>
