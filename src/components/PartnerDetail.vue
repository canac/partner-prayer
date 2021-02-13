<template>
  <div class="partner-detail">
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
import { format } from 'date-fns';
import { PropType, defineComponent, ref } from 'vue';
import useCreatePartnerRequest from '../composables/useCreatePartnerRequest';
import useDeletePartnerRequest from '../composables/useDeletePartnerRequest';
import { Partner, PartnerRequest } from '../types';

export default defineComponent({
  props: {
    partner: {
      type: Object as PropType<Partner>,
      required: true,
    },
  },

  setup(props) {
    const newRequest = ref('');

    const { createPartnerRequest } = useCreatePartnerRequest();
    const { deletePartnerRequest } = useDeletePartnerRequest();

    // Create a new partner request on the partner using the information in the form
    async function createRequest() {
      await createPartnerRequest(props.partner._id, newRequest.value);
      newRequest.value = '';
    }

    return {
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
