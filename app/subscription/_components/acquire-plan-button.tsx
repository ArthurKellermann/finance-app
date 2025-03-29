"use client";
import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";

const AcquirePlanButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleAcquirePlanClick = async () => {
    try {
      setLoading(true);
      const { sessionId } = await createStripeCheckout();

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Stripe not found");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  if (hasPremiumPlan) {
    return (
      <Button
        className="mt-4 w-full gap-2 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 font-medium text-blue-700 shadow-sm transition-all hover:shadow-md"
        variant="outline"
      >
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
          className="flex w-full items-center justify-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Gerenciar Assinatura
          <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
      onClick={handleAcquirePlanClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Assinar Agora
        </>
      )}
    </Button>
  );
};

export default AcquirePlanButton;
