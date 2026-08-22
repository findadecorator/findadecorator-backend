const quotes: Array<{
  id: string;
  jobId: string;
  professionalId: string;
  status: "draft" | "sent" | "accepted" | "declined";
  lines: Array<{ label: string; amountGbp: number }>;
  totalGbp: number;
}> = [];

function makeId(): string {
  return `quote_${Math.random().toString(36).slice(2, 10)}`;
}

export function listQuotes() {
  return quotes;
}

export function createQuote(input: { jobId: string; professionalId: string; lines: Array<{ label: string; amountGbp: number }> }) {
  const totalGbp = Number(input.lines.reduce((sum, line) => sum + line.amountGbp, 0).toFixed(2));
  const quote = { id: makeId(), ...input, status: "draft" as const, totalGbp };
  quotes.push(quote);
  return quote;
}

export function updateQuoteStatus(quoteId: string, status: "draft" | "sent" | "accepted" | "declined") {
  const quote = quotes.find((item) => item.id === quoteId);
  if (!quote) return null;
  quote.status = status;
  return quote;
}

