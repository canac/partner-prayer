import {
  PartnerRequestsFragment,
  PartnerRequestsFragmentDoc,
  useDeletePartnerRequestMutation,
} from '../generated/graphql';
import { PartnerRequest } from '../types';

export default function useDeletePartnerRequest(): {
  deletePartnerRequest: (request: PartnerRequest) => Promise<void>;
} {
  const { mutate } = useDeletePartnerRequestMutation({});

  async function deletePartnerRequest(
    deletingRequest: PartnerRequest,
  ): Promise<void> {
    await mutate(
      {
        input: {
          partnerRequestId: deletingRequest._id,
        },
      },
      {
        update(cache) {
          // Delete the partner request off of the partner in the cache
          const id = `Partner:${deletingRequest.partnerId}`;
          const fragment = PartnerRequestsFragmentDoc;
          const partner = cache.readFragment<PartnerRequestsFragment>({
            id,
            fragment,
          });
          if (partner) {
            cache.writeFragment({
              id,
              fragment,
              data: {
                requests: partner.requests.filter(
                  (request) => request._id !== deletingRequest._id,
                ),
              },
            });
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deletePartnerRequest: {
            __typename: 'DeletePartnerRequestPayload',
            partnerRequestId: deletingRequest._id,
          },
        },
      },
    );
  }

  return {
    deletePartnerRequest,
  };
}
