// lib/utils/currency.ts
export async function getUserCurrency(): Promise<string> {
  console.log("Fetching user currency...");
  const res = await fetch("/api/location");
  const data = await res.json();
  console.log("Location API response:", data);
  return data.currency || "NGN";
}

export async function convertPrice(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  console.log(`Converting ${amount} from ${from} to ${to}`);
  const res = await fetch(
    `/api/exchange?from=${from}&to=${to}&amount=${amount}`
  );
  const data = await res.json();
  console.log("Exchange API response:", data);
  return data.converted || amount;
}
