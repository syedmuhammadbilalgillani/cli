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

