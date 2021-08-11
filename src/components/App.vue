<template>
  <router-view />
</template>

<script lang="ts">
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faEye,
  faEyeSlash,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { defineComponent, provide } from 'vue';

// Load all icons used throughout the app
library.add(faCheck, faEye, faEyeSlash, faTimes, faTrash);

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

<style>
a {
  color: inherit;
  text-decoration: none;
}

body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
