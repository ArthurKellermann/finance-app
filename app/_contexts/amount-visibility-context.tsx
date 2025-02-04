"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AmountVisibilityContextType {
  isAmountVisible: boolean;
  toggleAmountVisibility: () => void;
}

const AmountVisibilityContext = createContext<
  AmountVisibilityContextType | undefined
>(undefined);

export function AmountVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  const toggleAmountVisibility = () => {
    setIsAmountVisible(!isAmountVisible);
  };

  return (
    <AmountVisibilityContext.Provider
      value={{ isAmountVisible, toggleAmountVisibility }}
    >
      {children}
    </AmountVisibilityContext.Provider>
  );
}

export function useAmountVisibility() {
  const context = useContext(AmountVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAmountVisibility must be used within an AmountVisibilityProvider",
    );
  }
  return context;
}
