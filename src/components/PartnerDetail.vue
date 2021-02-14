<template>
  <div
    v-if="partner"
    class="partner-detail"
  >
    <div class="partner-name">
      {{ partner.fullName }}
    </div>
    <div
      v-for="request in partner.requests"
      :key="request._id"
    >
      <span class="request-time">{{ formatRequestTimestamp(request) }}</span>:
      <span class="request-content">{{ request.request }}</span>
      <i
        class="fas fa-fw fa-times delete-request"
        @click="deleteRequest(request)"
      />
    </div>
    <form @submit.prevent="createRequest(newRequest)">
      <input
        v-model="newRequest"
        placeholder="Prayer request"
      >
      <button type="submit">
        Create
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { useApolloClient } from '@vue/apollo-composable';
import { format } from 'date-fns';
import {
  Ref, defineComponent, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import useCreatePartnerRequest from '../composables/useCreatePartnerRequest';
import useDeletePartnerRequest from '../composables/useDeletePartnerRequest';
import { PartnerFragment, PartnerFragmentDoc } from '../generated/graphql';
import { Partner, PartnerRequest } from '../types';

export default defineComponent({
  setup() {
    const partner: Ref<Partner | null> = ref(null);

    const newRequest = ref('');

    const { createPartnerRequest } = useCreatePartnerRequest();
    const { deletePartnerRequest } = useDeletePartnerRequest();

    // Create a new partner request on the partner using the information in the form
    async function createRequest() {
      if (!partner.value) {
        throw new Error('Partner does not exist');
      }

      await createPartnerRequest(partner.value._id, newRequest.value);
      newRequest.value = '';
    }

    const apollo = useApolloClient();

    const route = useRoute();
    watch(() => route.params, ({ partnerId }) => {
      if (typeof partnerId !== 'string') {
        throw new Error('Invalid partnerId');
      }

      const cachedPartner = apollo.client.readFragment<PartnerFragment>({
        id: `Partner:${partnerId}`,
        fragment: PartnerFragmentDoc,
      });

      partner.value = cachedPartner && {
        ...cachedPartner,

        // Add the partnerId to the requests
        requests: cachedPartner.requests.map((request) => ({
          ...request,
          partnerId,
        })),
      };
    }, { immediate: true });

    return {
      partner,
      newRequest,
      createRequest,
      deleteRequest: deletePartnerRequest,
    };
  },

  methods: {
    // Convert the request timestamp to a human-readable string
    formatRequestTimestamp(request: PartnerRequest): string {
      return format(new Date(request.createdAt), 'MMM d, yyyy');
    },
  },
});
</script>

<style scoped>
.partner-name {
  padding-bottom: 0.5em;
  font-size: 1.5em;
}

.delete-request {
  color: hsl(0, 50%, 50%);
}
</style>
