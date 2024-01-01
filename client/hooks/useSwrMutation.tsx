import { useSWRConfig } from "swr";

export const useSwrMutation = () => {
  const { mutate } = useSWRConfig();

  return {
    swrMutation: (key, method, optimisticData) => {
      return mutate(key, method, {
        optimisticData,
        populateCache: false,
        revalidate: true,
        rollbackOnError: true,
      });
    },
  };
};
