import { TSession } from "../hooks/useSession";

export default async function requestOTP(session: TSession["session"]) {
  console.log(session);

  await fetch("http://192.168.1.103:3000/otp/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: session?.user?.id,
      email: session?.user?.email,
    }),
  });
}
