import { Banks, CreditCardStatus, CreditCardType } from "@prisma/client";

export const CREDIT_CARD_TYPE_LABELS = {
  [CreditCardType.VISA]: "Visa",
  [CreditCardType.MASTERCARD]: "MasterCard",
  [CreditCardType.ELO]: "Elo",
  [CreditCardType.AMERICAN_EXPRESS]: "American Express",
  [CreditCardType.HIPERCARD]: "Hipercard",
  [CreditCardType.OTHER]: "Outro",
};

export const CREDIT_CARD_STATUS_LABELS = {
  [CreditCardStatus.ACTIVE]: "Ativo",
  [CreditCardStatus.SUSPENDED]: "Suspenso",
  [CreditCardStatus.BLOCKED]: "Bloqueado",
  [CreditCardStatus.EXPIRED]: "Expirado",
  [CreditCardStatus.CANCELLED]: "Cancelado",
};

export const BANK_LABELS = {
  [Banks.BRADESCO]: "Bradesco",
  [Banks.ITAU]: "Itaú",
  [Banks.CAIXA_ECONOMICA]: "Caixa Econômica",
  [Banks.SANTANDER]: "Santander",
  [Banks.BANCO_DO_BRASIL]: "Banco do Brasil",
  [Banks.HSBC]: "HSBC",
  [Banks.BANRISUL]: "Banrisul",
  [Banks.BNB]: "BNB",
  [Banks.BTG_PACTUAL]: "BTG Pactual",
  [Banks.ORIGINAL]: "Original",
  [Banks.INTER]: "Inter",
  [Banks.PAN]: "Pan",
};
