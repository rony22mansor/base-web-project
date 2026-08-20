/**
 * TEMPORARY mock data — replace with the real Python backend.
 *
 * Everything here is invented for UI development. The Arabic template names and
 * descriptions below are NOT vetted legal documents. Delete this file (and the
 * USE_MOCKS branch in contractTemplatesService) once the backend is live;
 * nothing outside the service layer imports it.
 */
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import type { PagedResult } from "@/src/core/types/pagination";
import { ContractTemplateType } from "../../enums/contractEnums";
import type { ContractTemplateSearchParams } from "../../types/dtos";
import type {
  ContractTemplate,
  ContractTemplateTypeCount,
} from "../../types/interfaces/contractTemplateInterface";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const MOCK_BROWSE_DELAY_MS = 600;
/** Semantic retrieval is slower than a plain list — reflect that in the UI. */
const MOCK_SEARCH_DELAY_MS = 1300;

const MOCK_TEMPLATES: ContractTemplate[] = [
  {
    id: "tpl-employment-fixed",
    name: "عقد عمل محدد المدة",
    type: ContractTemplateType.Employment,
    description:
      "عقد عمل بين صاحب عمل وعامل لمدة محددة، يتضمن الأجر وساعات العمل والإجازات وشروط الإنهاء والتعويض.",
    fieldCount: 14,
    clauseCount: 18,
    updatedAt: "2025-11-02",
  },
  {
    id: "tpl-employment-open",
    name: "عقد عمل غير محدد المدة",
    type: ContractTemplateType.Employment,
    description:
      "عقد عمل مفتوح المدة مع فترة تجربة، ينظّم واجبات الطرفين ومدد الإنذار قبل الإنهاء.",
    fieldCount: 12,
    clauseCount: 16,
    updatedAt: "2025-09-18",
  },
  {
    id: "tpl-lease-residential",
    name: "عقد إيجار سكني",
    type: ContractTemplateType.Lease,
    description:
      "عقد إيجار مأجور سكني يحدد البدل ومواعيد الدفع والتأمين والتزامات الصيانة وشروط التجديد والإخلاء.",
    fieldCount: 16,
    clauseCount: 20,
    updatedAt: "2026-01-12",
  },
  {
    id: "tpl-lease-commercial",
    name: "عقد إيجار محل تجاري",
    type: ContractTemplateType.Lease,
    description:
      "عقد إيجار لمحل تجاري يتضمن بنود الفروغ والتنازل عن الإجارة وتغيير وجه الاستثمار.",
    fieldCount: 18,
    clauseCount: 24,
    updatedAt: "2025-12-01",
  },
  {
    id: "tpl-sale-vehicle",
    name: "عقد بيع سيارة",
    type: ContractTemplateType.Sale,
    description:
      "عقد بيع مركبة يوثّق أوصافها والثمن وتاريخ التسليم وإقرار المشتري بمعاينتها وبراءة ذمة البائع.",
    fieldCount: 11,
    clauseCount: 12,
    updatedAt: "2025-08-07",
  },
  {
    id: "tpl-sale-realestate",
    name: "عقد بيع عقار",
    type: ContractTemplateType.Sale,
    description:
      "وعد بالبيع لعقار يحدد الثمن ودفعاته والتزام البائع بنقل الملكية وضمان الاستحقاق والشرط الجزائي.",
    fieldCount: 20,
    clauseCount: 26,
    updatedAt: "2026-02-20",
  },
  {
    id: "tpl-services-consulting",
    name: "عقد تقديم خدمات استشارية",
    type: ContractTemplateType.Services,
    description:
      "عقد بين مقدم خدمة وعميل يحدد نطاق العمل ومراحل التسليم والأتعاب وملكية المخرجات.",
    fieldCount: 13,
    clauseCount: 17,
    updatedAt: "2025-10-29",
  },
  {
    id: "tpl-services-maintenance",
    name: "عقد صيانة دورية",
    type: ContractTemplateType.Services,
    description:
      "عقد صيانة يحدد دورية الزيارات وزمن الاستجابة والأعطال المشمولة وحدود المسؤولية.",
    fieldCount: 10,
    clauseCount: 14,
    updatedAt: "2025-07-15",
  },
  {
    id: "tpl-partnership-general",
    name: "عقد شركة تضامن",
    type: ContractTemplateType.Partnership,
    description:
      "عقد تأسيس شركة تضامنية يحدد حصص الشركاء وإدارة الشركة وتوزيع الأرباح وأحوال الانسحاب والحل.",
    fieldCount: 19,
    clauseCount: 28,
    updatedAt: "2025-11-23",
  },
  {
    id: "tpl-partnership-limited",
    name: "عقد شركة محدودة المسؤولية",
    type: ContractTemplateType.Partnership,
    description:
      "نظام أساسي لشركة محدودة المسؤولية يتضمن رأس المال والحصص وصلاحيات المدير والجمعية العامة.",
    fieldCount: 22,
    clauseCount: 30,
    updatedAt: "2026-03-04",
  },
  {
    id: "tpl-nda-mutual",
    name: "اتفاقية عدم إفشاء متبادلة",
    type: ContractTemplateType.NonDisclosure,
    description:
      "اتفاقية سرية متبادلة تحدد المعلومات المشمولة ومدة الالتزام والاستثناءات والجزاء على المخالفة.",
    fieldCount: 9,
    clauseCount: 11,
    updatedAt: "2025-06-30",
  },
  {
    id: "tpl-nda-oneway",
    name: "اتفاقية عدم إفشاء أحادية",
    type: ContractTemplateType.NonDisclosure,
    description:
      "اتفاقية سرية يلتزم بها طرف واحد تجاه الطرف المفصح، مع تحديد الغرض المسموح باستخدام المعلومات فيه.",
    fieldCount: 8,
    clauseCount: 10,
    updatedAt: "2025-05-11",
  },
];

/** Naive token overlap — stands in for the backend embedding similarity. */
const scoreAgainstQuery = (
  template: ContractTemplate,
  query: string,
): number => {
  const tokens = query
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return 0;

  const haystack = `${template.name} ${template.description}`.toLowerCase();
  const hits = tokens.filter((token) =>
    haystack.includes(token.toLowerCase()),
  ).length;

  return hits / tokens.length;
};

/** Strict retrieval: a query that hits nothing yields an empty grid. */
const MIN_SCORE = 0.34;

export async function mockSearchContractTemplates(
  params: ContractTemplateSearchParams,
): Promise<ApiResponse<PagedResult<ContractTemplate>>> {
  const query = params.query?.trim() ?? "";
  await delay(query ? MOCK_SEARCH_DELAY_MS : MOCK_BROWSE_DELAY_MS);

  let matches = MOCK_TEMPLATES.filter(
    (template) => !params.type || template.type === params.type,
  );

  if (query) {
    matches = matches
      .map((template) => ({
        ...template,
        score: scoreAgainstQuery(template, query),
      }))
      .filter((template) => (template.score ?? 0) >= MIN_SCORE)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    // Most recently revised first while browsing.
    matches = [...matches].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  const start = (params.page - 1) * params.pageSize;
  const items = matches.slice(start, start + params.pageSize);

  return {
    data: {
      items,
      page: params.page,
      pageSize: params.pageSize,
      total: matches.length,
      hasMore: start + items.length < matches.length,
    },
    succeeded: true,
  };
}

export async function mockGetContractTemplateTypes(): Promise<
  ApiResponse<ContractTemplateTypeCount[]>
> {
  await delay(300);

  const counts = Object.values(ContractTemplateType).map((type) => ({
    type,
    count: MOCK_TEMPLATES.filter((template) => template.type === type).length,
  }));

  return { data: counts, succeeded: true };
}
