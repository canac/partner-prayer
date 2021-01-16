import { format } from 'date-fns';

// Serialize a JS Date object to a format that can be interpreted as a GraphQL Date type
export function dateToGqlDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export async function query(query: string, variables: any): Promise<any> {
  const res = await fetch(import.meta.env.SNOWPACK_PUBLIC_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return (await res.json()).data;
}
