import { format } from 'date-fns';

// Serialize a JS Date object to a format that can be interpreted as a GraphQL Date type
export function dateToGqlDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}
