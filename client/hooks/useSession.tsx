import useSwrFetcher from "./useSwrFetcher";
import { Alert } from "react-native";
const useSession = () => {
  const { swrFetcher } = useSwrFetcher();
  const baseUrl = process?.env?.EXPO_PUBLIC_URL_ADDRESS || "";

  const { swrResult } = swrFetcher(
    "api/checkVerify",
    async () => (await fetch(`${baseUrl}/authentication/getCookie`)).json(),
    {
      refreshInterval: 1000,
    },
  );

  if (swrResult?.status === 401) {
    return {
      session: undefined,
      error: {
        title: "User not verify",
        body: "You need signup or login!",
      },
    };
  }
  if (swrResult?.status === 400) {
    return {
      session: undefined,
      error: {
        title: "User not verify",
        body: "User not access to app!",
      },
    };
  }
  return {
    session: swrResult,
    error: null,
  };
};

export default useSession;

export type TSession = {
  session:
    | {
        status: number;
        user: {
          confirmed: boolean;
          email: string;
          exp: number;
          iat: number;
          id: string;
          username: string;
        };
      }
    | undefined;
  error: {
    title: string;
    body: string;
  } | null;
};
