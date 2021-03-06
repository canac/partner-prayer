import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};










export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type PartnerRequest = {
  __typename?: 'PartnerRequest';
  _id: Scalars['ID'];
  partner: Partner;
  createdAt: Scalars['Date'];
  request: Scalars['String'];
};

export type Partner = {
  __typename?: 'Partner';
  _id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  fullName: Scalars['String'];
  requests: Array<PartnerRequest>;
};

export type ScheduleDay = {
  __typename?: 'ScheduleDay';
  _id: Scalars['ID'];
  schedule: Schedule;
  dayId: Scalars['Int'];
  partners: Array<Partner>;
  isSkipped: Scalars['Boolean'];
};

export type Schedule = {
  __typename?: 'Schedule';
  _id: Scalars['ID'];
  month: Scalars['Date'];
  completedDays: Scalars['Int'];
  days: Array<ScheduleDay>;
};

export type Query = {
  __typename?: 'Query';
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  schedule: Schedule;
};


export type QueryPartnerArgs = {
  id: Scalars['ID'];
};


export type QueryScheduleArgs = {
  month: Scalars['Date'];
};

export type CreatePartnerRequestInput = {
  partnerId: Scalars['String'];
  request: Scalars['String'];
};

export type DeletePartnerRequestInput = {
  partnerRequestId: Scalars['String'];
};

export type DeletePartnerRequestPayload = {
  __typename?: 'DeletePartnerRequestPayload';
  partnerRequestId: Scalars['String'];
};

export type CompleteDayInput = {
  scheduleId: Scalars['String'];
  completedDays: Scalars['Int'];
};

export type SkipDayInput = {
  scheduleId: Scalars['String'];
  dayId: Scalars['Int'];
  isSkipped: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPartnerRequest: PartnerRequest;
  deletePartnerRequest: DeletePartnerRequestPayload;
  completeDay: Schedule;
  skipDay: Schedule;
};


export type MutationCreatePartnerRequestArgs = {
  input: CreatePartnerRequestInput;
};


export type MutationDeletePartnerRequestArgs = {
  input: DeletePartnerRequestInput;
};


export type MutationCompleteDayArgs = {
  input: CompleteDayInput;
};


export type MutationSkipDayArgs = {
  input: SkipDayInput;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type CompleteDayMutationVariables = Exact<{
  input: CompleteDayInput;
}>;


export type CompleteDayMutation = (
  { __typename?: 'Mutation' }
  & { schedule: (
    { __typename?: 'Schedule' }
    & Pick<Schedule, '_id' | 'completedDays'>
    & { days: Array<(
      { __typename?: 'ScheduleDay' }
      & Pick<ScheduleDay, '_id'>
      & { partners: Array<(
        { __typename?: 'Partner' }
        & Pick<Partner, '_id'>
      )> }
    )> }
  ) }
);

export type CreatePartnerRequestMutationVariables = Exact<{
  input: CreatePartnerRequestInput;
}>;


export type CreatePartnerRequestMutation = (
  { __typename?: 'Mutation' }
  & { createPartnerRequest: (
    { __typename?: 'PartnerRequest' }
    & Pick<PartnerRequest, '_id' | 'createdAt' | 'request'>
  ) }
);

export type DeletePartnerRequestMutationVariables = Exact<{
  input: DeletePartnerRequestInput;
}>;


export type DeletePartnerRequestMutation = (
  { __typename?: 'Mutation' }
  & { deletePartnerRequest: (
    { __typename?: 'DeletePartnerRequestPayload' }
    & Pick<DeletePartnerRequestPayload, 'partnerRequestId'>
  ) }
);

export type LoadPartnerQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LoadPartnerQuery = (
  { __typename?: 'Query' }
  & { partner?: Maybe<(
    { __typename?: 'Partner' }
    & PartnerFragment
  )> }
);

export type LoadScheduleQueryVariables = Exact<{
  month: Scalars['Date'];
}>;


export type LoadScheduleQuery = (
  { __typename?: 'Query' }
  & { schedule: (
    { __typename?: 'Schedule' }
    & Pick<Schedule, '_id' | 'completedDays'>
    & { days: Array<(
      { __typename?: 'ScheduleDay' }
      & Pick<ScheduleDay, '_id' | 'isSkipped' | 'dayId'>
      & { partners: Array<(
        { __typename?: 'Partner' }
        & PartnerFragment
      )> }
    )> }
  ) }
);

export type PartnerFragment = (
  { __typename?: 'Partner' }
  & Pick<Partner, '_id' | 'fullName'>
  & { requests: Array<(
    { __typename?: 'PartnerRequest' }
    & Pick<PartnerRequest, '_id' | 'createdAt' | 'request'>
  )> }
);

export type PartnerRequestsFragment = (
  { __typename?: 'Partner' }
  & { requests: Array<(
    { __typename?: 'PartnerRequest' }
    & Pick<PartnerRequest, '_id'>
  )> }
);

export type SkipDayMutationVariables = Exact<{
  input: SkipDayInput;
}>;


export type SkipDayMutation = (
  { __typename?: 'Mutation' }
  & { schedule: (
    { __typename?: 'Schedule' }
    & Pick<Schedule, '_id' | 'completedDays'>
    & { days: Array<(
      { __typename?: 'ScheduleDay' }
      & Pick<ScheduleDay, '_id' | 'isSkipped'>
      & { partners: Array<(
        { __typename?: 'Partner' }
        & Pick<Partner, '_id'>
      )> }
    )> }
  ) }
);

export const PartnerFragmentDoc = gql`
    fragment Partner on Partner {
  _id
  fullName
  requests {
    _id
    createdAt
    request
  }
}
    `;
export const PartnerRequestsFragmentDoc = gql`
    fragment PartnerRequests on Partner {
  requests {
    _id
  }
}
    `;
export const CompleteDayDocument = gql`
    mutation CompleteDay($input: CompleteDayInput!) {
  schedule: completeDay(input: $input) {
    _id
    completedDays
    days {
      _id
      partners {
        _id
      }
    }
  }
}
    `;

/**
 * __useCompleteDayMutation__
 *
 * To run a mutation, you first call `useCompleteDayMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCompleteDayMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCompleteDayMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCompleteDayMutation(options: VueApolloComposable.UseMutationOptions<CompleteDayMutation, CompleteDayMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CompleteDayMutation, CompleteDayMutationVariables>>) {
  return VueApolloComposable.useMutation<CompleteDayMutation, CompleteDayMutationVariables>(CompleteDayDocument, options);
}
export type CompleteDayMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CompleteDayMutation, CompleteDayMutationVariables>;
export const CreatePartnerRequestDocument = gql`
    mutation CreatePartnerRequest($input: CreatePartnerRequestInput!) {
  createPartnerRequest(input: $input) {
    _id
    createdAt
    request
  }
}
    `;

/**
 * __useCreatePartnerRequestMutation__
 *
 * To run a mutation, you first call `useCreatePartnerRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreatePartnerRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreatePartnerRequestMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreatePartnerRequestMutation(options: VueApolloComposable.UseMutationOptions<CreatePartnerRequestMutation, CreatePartnerRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreatePartnerRequestMutation, CreatePartnerRequestMutationVariables>>) {
  return VueApolloComposable.useMutation<CreatePartnerRequestMutation, CreatePartnerRequestMutationVariables>(CreatePartnerRequestDocument, options);
}
export type CreatePartnerRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreatePartnerRequestMutation, CreatePartnerRequestMutationVariables>;
export const DeletePartnerRequestDocument = gql`
    mutation DeletePartnerRequest($input: DeletePartnerRequestInput!) {
  deletePartnerRequest(input: $input) {
    partnerRequestId
  }
}
    `;

/**
 * __useDeletePartnerRequestMutation__
 *
 * To run a mutation, you first call `useDeletePartnerRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeletePartnerRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeletePartnerRequestMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useDeletePartnerRequestMutation(options: VueApolloComposable.UseMutationOptions<DeletePartnerRequestMutation, DeletePartnerRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeletePartnerRequestMutation, DeletePartnerRequestMutationVariables>>) {
  return VueApolloComposable.useMutation<DeletePartnerRequestMutation, DeletePartnerRequestMutationVariables>(DeletePartnerRequestDocument, options);
}
export type DeletePartnerRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeletePartnerRequestMutation, DeletePartnerRequestMutationVariables>;
export const LoadPartnerDocument = gql`
    query LoadPartner($id: ID!) {
  partner(id: $id) {
    ...Partner
  }
}
    ${PartnerFragmentDoc}`;

/**
 * __useLoadPartnerQuery__
 *
 * To run a query within a Vue component, call `useLoadPartnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadPartnerQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useLoadPartnerQuery({
 *   id: // value for 'id'
 * });
 */
export function useLoadPartnerQuery(variables: LoadPartnerQueryVariables | VueCompositionApi.Ref<LoadPartnerQueryVariables> | ReactiveFunction<LoadPartnerQueryVariables>, options: VueApolloComposable.UseQueryOptions<LoadPartnerQuery, LoadPartnerQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LoadPartnerQuery, LoadPartnerQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LoadPartnerQuery, LoadPartnerQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<LoadPartnerQuery, LoadPartnerQueryVariables>(LoadPartnerDocument, variables, options);
}
export type LoadPartnerQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<LoadPartnerQuery, LoadPartnerQueryVariables>;
export const LoadScheduleDocument = gql`
    query LoadSchedule($month: Date!) {
  schedule(month: $month) {
    _id
    completedDays
    days {
      _id
      isSkipped
      dayId
      partners {
        ...Partner
      }
    }
  }
}
    ${PartnerFragmentDoc}`;

/**
 * __useLoadScheduleQuery__
 *
 * To run a query within a Vue component, call `useLoadScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadScheduleQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useLoadScheduleQuery({
 *   month: // value for 'month'
 * });
 */
export function useLoadScheduleQuery(variables: LoadScheduleQueryVariables | VueCompositionApi.Ref<LoadScheduleQueryVariables> | ReactiveFunction<LoadScheduleQueryVariables>, options: VueApolloComposable.UseQueryOptions<LoadScheduleQuery, LoadScheduleQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LoadScheduleQuery, LoadScheduleQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LoadScheduleQuery, LoadScheduleQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<LoadScheduleQuery, LoadScheduleQueryVariables>(LoadScheduleDocument, variables, options);
}
export type LoadScheduleQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<LoadScheduleQuery, LoadScheduleQueryVariables>;
export const SkipDayDocument = gql`
    mutation SkipDay($input: SkipDayInput!) {
  schedule: skipDay(input: $input) {
    _id
    completedDays
    days {
      _id
      isSkipped
      partners {
        _id
      }
    }
  }
}
    `;

/**
 * __useSkipDayMutation__
 *
 * To run a mutation, you first call `useSkipDayMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSkipDayMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSkipDayMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useSkipDayMutation(options: VueApolloComposable.UseMutationOptions<SkipDayMutation, SkipDayMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SkipDayMutation, SkipDayMutationVariables>>) {
  return VueApolloComposable.useMutation<SkipDayMutation, SkipDayMutationVariables>(SkipDayDocument, options);
}
export type SkipDayMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SkipDayMutation, SkipDayMutationVariables>;