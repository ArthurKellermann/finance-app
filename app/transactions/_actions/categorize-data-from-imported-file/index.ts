"use server";

import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs/server";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import { TransactionPaymentMethod } from "@prisma/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const categorizeDataFromImportedFile = async (fileText: string) => {
  try {
    const { userId } = auth();

    const categories = await getDefaultCategories();

    const prompt = `
      Você é um assistente especializado em categorizar transações financeiras. Sua tarefa é processar transações extraídas de um arquivo CSV de extrato bancário e convertê-las em um formato específico usado pela aplicação.

      ### Formato de Entrada (CSV):
      As transações virão no seguinte formato:
      "Data","Lançamento","Detalhes","N° documento","Valor","Tipo Lançamento"

      ### Formato de Saída Esperado (JSON):
      Para cada transação, você deve retornar um objeto JSON com os seguintes campos:
      - name: Nome da transação (use o campo "Detalhes" do CSV, removendo a data, horário e numero do documento. Mantenha APENAS o nome).
      - type: Tipo de transação (DEPOSIT ou EXPENSE. Use "DEPOSIT" para "Entrada" e "EXPENSE" para "Saída").
      - categoryId: ID da categoria correspondente (interprete o contexto do campo "Detalhes" e associe à categoria mais adequada).
      - amount: Valor da transação (converta para número e garanta que não seja negativo).
      - paymentMethod: Método de pagamento (use um dos métodos disponíveis: ${JSON.stringify(TransactionPaymentMethod)}. Para compras com cartão, defina como "DEBIT_CARD").
      - date: Data da transação (no formato ISO 8601).
      - userId: Adicione esse atributo com o valor '${userId}' em todos os objetos.

      ### Categorias Disponíveis:
      Aqui estão as categorias disponíveis para classificação:
      ${JSON.stringify(
        categories?.map((cat) => {
          return { name: cat.value, id: cat.categoryId };
        }),
      )}

      ### Regras Importantes:
      1. Remova a data e o horário do campo "Detalhes" e mantenha apenas o nome da transação.
      2. Converta o valor para número e garanta que não seja negativo.
      3. Para compras com cartão, defina o método de pagamento como "DEBIT_CARD".
      4. A data deve estar no formato ISO 8601.
      5. Adicione o campo "userId" com o valor '${userId}' em todos os objetos.
      6. O N° documento deve ser removido.

      ### Exemplo de Entrada e Saída:
      #### Entrada (CSV):
      "03/02/2025","Pix - Enviado","03/02 14:14 João Vitor da Silva","20305","-35.00","Saída"

      #### Saída (JSON):
      [
        {
          "name": "João Vitor da Silva",
          "type": "EXPENSE",
          "categoryId": "e81fc8be-73f4-4177-b55e-7c97330a6b3a", // ID da categoria "OTHER"
          "amount": 35.00,
          "paymentMethod": "PIX",
          "date": "2025-02-03T00:00:00.000Z",
          "userId": "${userId}"
        }
      ]

      ### Transações para Categorizar:
      ${fileText}

      ### Instrução Final:
      Retorne APENAS um array de objetos JSON no formato especificado, com exatamente 7 atributos, sem texto adicional, exemplos de código ou explicações.
      A resposta deve começar com "[" e terminar com "]".
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    });

    console.log("Resposta da OpenAI:", response.choices[0].message.content);
    console.log("Tokens usados:", response.usage?.total_tokens);
    console.log("Motivo de término:", response.choices[0].finish_reason);

    if (response.choices[0].finish_reason === "length") {
      throw new Error(
        "A resposta foi truncada devido ao limite de tokens. Aumente o limite ou divida o arquivo CSV.",
      );
    }

    const responseContent = response.choices[0].message.content?.trim() || "";
    if (!responseContent.startsWith("[") || !responseContent.endsWith("]")) {
      throw new Error("Resposta da OpenAI não é um array JSON válido.");
    }

    let categorizedTransactions;
    try {
      categorizedTransactions = JSON.parse(responseContent);
    } catch (error) {
      throw new Error("Erro ao fazer parsing do JSON: " + error);
    }

    console.log("Transações Categorizadas:", categorizedTransactions);
    return { success: true, data: categorizedTransactions };
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    return { success: false, message: "Erro ao processar o arquivo." };
  }
};
