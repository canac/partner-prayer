import { v4 } from 'uuid';
import {
  PartnerRequestsFragment,
  PartnerRequestsFragmentDoc,
  useCreatePartnerRequestMutation,
} from '../generated/graphql';
import { PartnerRequest } from '../types';

export default function useCreatePartnerRequest(): {
  createPartnerRequest: (
    partnerId: string,
    request: string,
  ) => Promise<PartnerRequest>;
} {
  const { mutate } = useCreatePartnerRequestMutation({});

  async function createPartnerRequest(
    partnerId: string,
    request: string,
  ): Promise<PartnerRequest> {
    const { data } = await mutate(
      {
        input: {
          partnerId,
          request,
        },
      },
      {
        update(cache, result) {
          const newPartnerRequest = result.data?.createPartnerRequest;
          if (!newPartnerRequest) {
            return;
          }

          // Add the partner request to the partner's requests in the cache
          const id = `Partner:${partnerId}`;
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
                requests: [...partner.requests, newPartnerRequest],
              },
            });
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createPartnerRequest: {
            __typename: 'PartnerRequest',
            _id: v4(),
            createdAt: new Date(),
            request,
          },
        },
      },
    );

    if (!data) {
      throw new Error('Partner request was not created');
    }

    return {
      ...data.createPartnerRequest,
      partnerId,
    };
  }

  return {
    createPartnerRequest,
  };
}
