import { ContractSearchContainer } from "@/src/features/contract-templates/components/ContractSearchContainer";

/**
 * No `BasePage` here: the browse screens own their own scroll area so the
 * search bar can stay anchored to the bottom of the viewport.
 */
export default function ContractTemplatesPage() {
  return <ContractSearchContainer />;
}
