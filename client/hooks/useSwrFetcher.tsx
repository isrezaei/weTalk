import useSWR from "swr";

const useSwrFetcher = () => {
  return {
    swrFetcher: (key, fetcher, options) => {
      const { data, error, mutate } = useSWR(key, fetcher, options);
      return {
        swrResult: data,
        error,
        mutate,
      };
    },
  };
};

export default useSwrFetcher;
