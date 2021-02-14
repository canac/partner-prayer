<template>
  <router-view />
</template>

<script lang="ts">
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { defineComponent, provide } from 'vue';

import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

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
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
});
</script>
