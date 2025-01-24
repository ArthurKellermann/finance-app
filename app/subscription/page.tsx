import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }
  return <div>Subscription</div>;
};

export default SubscriptionPage;
