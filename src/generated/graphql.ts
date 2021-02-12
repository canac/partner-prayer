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


export type Partner = {
  __typename?: 'Partner';
  _id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
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
  partners?: Maybe<Array<Maybe<Partner>>>;
  schedule?: Maybe<Schedule>;
};


export type QueryScheduleArgs = {
  month: Scalars['Date'];
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
  completeDay?: Maybe<Schedule>;
  skipDay?: Maybe<Schedule>;
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
  & { schedule?: Maybe<(
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
  )> }
);

export type LoadScheduleQueryVariables = Exact<{
  month: Scalars['Date'];
}>;


export type LoadScheduleQuery = (
  { __typename?: 'Query' }
  & { schedule?: Maybe<(
    { __typename?: 'Schedule' }
    & Pick<Schedule, '_id' | 'completedDays'>
    & { days: Array<(
      { __typename?: 'ScheduleDay' }
      & Pick<ScheduleDay, 'isSkipped' | 'dayId'>
      & { partners: Array<(
        { __typename?: 'Partner' }
        & Pick<Partner, 'firstName' | 'lastName'>
      )> }
    )> }
  )> }
);

export type SkipDayMutationVariables = Exact<{
  input: SkipDayInput;
}>;


export type SkipDayMutation = (
  { __typename?: 'Mutation' }
  & { schedule?: Maybe<(
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
  )> }
);


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
export const LoadScheduleDocument = gql`
    query LoadSchedule($month: Date!) {
  schedule(month: $month) {
    _id
    completedDays
    days {
      isSkipped
      dayId
      partners {
        firstName
        lastName
      }
    }
  }
}
    `;

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
