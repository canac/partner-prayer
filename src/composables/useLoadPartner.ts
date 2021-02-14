import { useApolloClient, useResult } from '@vue/apollo-composable';
import { Ref, computed } from 'vue';
import {
  LoadPartnerQuery, PartnerFragment, PartnerFragmentDoc, useLoadPartnerQuery,
} from '../generated/graphql';
import { Partner } from '../types';

function normalizePartner(partner: PartnerFragment): Partner {
  return {
    ...partner,

    // Add the partnerId to the requests
    requests: partner.requests.map((request) => ({
      ...request,
      partnerId: partner._id,
    })),
  };
}

export default function useLoadPartner(partnerId: Ref<string>): {
  partner: Ref<Partner | null>,
} {
  // Load the partner from the cache
  const apollo = useApolloClient();
  const cachedPartner = computed(() => apollo.client.readFragment<PartnerFragment>({
    id: `Partner:${partnerId.value}`,
    fragment: PartnerFragmentDoc,
  }));

  // Simultaneously, load the partner from the network
  const { result, loading } = useLoadPartnerQuery(() => ({ id: partnerId.value }));
  const loadedPartner: Ref<PartnerFragment | null | undefined> = useResult<LoadPartnerQuery, 'partner'>(result);

  return {
    partner: computed((): Partner | null => {
      const partner = loading.value ? cachedPartner.value : loadedPartner.value;
      return partner ? normalizePartner(partner) : null;
    }),
  };
}
