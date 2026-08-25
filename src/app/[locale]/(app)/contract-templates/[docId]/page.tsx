import { ContractEditorContainer } from "@/src/features/contract-templates/components/ContractEditorContainer";
import { BasePage } from "@/src/shared/components/base-page";

/**
 * Doc ids contain a `#` ("390277833119024#2") and are percent-encoded into the
 * path by `AppRoutes.contractTemplate`. Next hands the segment back still
 * encoded, so it is decoded here before it reaches the API — an unencoded one
 * would be read as a URL fragment and never arrive at the server at all.
 */
export default async function ContractTemplatePage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;

  return (
    <BasePage>
      <ContractEditorContainer docId={decodeURIComponent(docId)} />
    </BasePage>
  );
}
