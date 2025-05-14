// // pages/index.tsx
// import { dehydrate, QueryClient } from "@tanstack/react-query";
// import { TanstackProvider } from "@/components/TanstackProvider";
// import { getSomeData } from "@/lib/getSomeData";

// export default async function Page() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["some-data"],
//     queryFn: getSomeData,
//   });

//   const dehydratedState = dehydrate(queryClient);

//   return (
//     <TanstackProvider dehydratedState={dehydratedState}>
//       {/* Your page content here */}
//     </TanstackProvider>
//   );
// }


// export const useGetCities = (page: number, per_page: number) => {
//   const query = useQuery({
//     queryKey: ["cityList", page, per_page], // Query key based on page, pageSize, and searchTerm
//     queryFn: async () => {
//       const data = await fetchCities({ page, per_page });
//       return data?.data;
//     },
//     placeholderData: (prevData) => prevData || [], // Use previous data as placeholder
//   });

//   // Handle errors using React's effects or other state management
//   if (query?.isError) {
//     console.error("Error fetching users:", query.error);
//     // toast.error("Something went wrong while fetching user list!");
//   }

//   return query;
// };
