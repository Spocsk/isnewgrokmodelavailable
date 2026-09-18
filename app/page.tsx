import { detectGrok47 } from "@/lib/detect-grok-47";
import { Plate } from "./plate";

export const revalidate = 15;

export default async function Page() {
  const initial = await detectGrok47();
  return <Plate initial={initial} />;
}
