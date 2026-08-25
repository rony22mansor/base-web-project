import { LawDetailContainer } from "@/src/features/law-search/components/LawDetailContainer";

/**
 * One law. The segment is an `encodeURIComponent`-ed law id — Arabic, spaces,
 * and in one law a comma — so it is decoded back before anything uses it.
 */
export default async function LawPage({
  params,
}: {
  params: Promise<{ lawId: string }>;
}) {
  const { lawId } = await params;

  return <LawDetailContainer lawId={decodeURIComponent(lawId)} />;
}
