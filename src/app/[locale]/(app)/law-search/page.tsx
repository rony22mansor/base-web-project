import { LawSearchContainer } from "@/src/features/law-search/components/LawSearchContainer";

/**
 * No `BasePage` here: the browse screens own their own scroll area so the
 * search bar can stay anchored to the bottom of the viewport. They slot
 * straight into the flex column the (app) layout provides.
 */
export default function LawSearchPage() {
  return <LawSearchContainer />;
}
