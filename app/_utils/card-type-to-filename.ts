import { CreditCardType } from "@prisma/client";

export const cardTypeToFilename = (type: CreditCardType): string => {
  const cardTypeToFileName: Record<CreditCardType, string> = {
    [CreditCardType.VISA]: "visa",
    [CreditCardType.MASTERCARD]: "mastercard",
    [CreditCardType.ELO]: "elo",
    [CreditCardType.AMERICAN_EXPRESS]: "amex",
    [CreditCardType.HIPERCARD]: "hipercard",
    [CreditCardType.OTHER]: "generic",
  };

  const fileName = cardTypeToFileName[type];
  return `/credit-cards/${fileName}.svg`;
};
