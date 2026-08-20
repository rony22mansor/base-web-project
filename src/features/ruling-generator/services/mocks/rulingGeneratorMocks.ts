/**
 * TEMPORARY mock data — replace with the real Python RAG backend.
 *
 * Everything in this file is invented for UI development. The Arabic legal text
 * below is NOT authoritative and must not be treated as real law. Delete this
 * file (and the USE_MOCKS branch in rulingGeneratorService) once the backend is
 * live; nothing outside the service layer imports it.
 */
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { ArticleStatus, CaseCategory } from "../../enums/rulingEnums";
import type {
  ExtractedDocument,
  RulingResult,
} from "../../types/interfaces/rulingInterface";
import type { GenerateRulingDto } from "../../types/dtos";

/** Local so this module stays free of client-only imports. */
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Long enough to exercise the loading screen properly. */
const MOCK_GENERATE_DELAY_MS = 2400;
const MOCK_EXTRACT_DELAY_MS = 900;

const MOCK_RULING: RulingResult = {
  matched: true,
  ruling:
    "يُرجَّح إدانة المدعى عليه بجنحة الإيذاء المقصود التي نتج عنها تعطيل عن العمل لمدة تتجاوز العشرة أيام، مع الأخذ بالأسباب المخففة التقديرية نظراً لعدم وجود سوابق قضائية بحقه.",
  confidence: 0.82,
  explanation:
    "استناداً إلى الوقائع المعروضة، توافرت أركان جرم الإيذاء المقصود: الركن المادي المتمثل بفعل الاعتداء الذي أفضى إلى أذى جسدي موثّق بتقرير طبي، والركن المعنوي المتمثل بقصد إحداث الأذى دون قصد القتل. ولمّا كانت مدة التعطيل عن العمل قد تجاوزت العشرة أيام، فإن الوصف القانوني ينتقل من المخالفة إلى الجنحة. ولا يُستفاد من الوقائع قيام حالة دفاع مشروع، إذ لم يثبت أن الاعتداء كان صادّاً لخطر حالٍّ. ويبقى تقدير الأسباب المخففة عائداً للمحكمة وفق ظروف الفاعل وسوابقه.",
  legalBasis: [
    {
      id: "art-540",
      articleNumber: "المادة 540",
      lawName: "قانون العقوبات السوري",
      hierarchy: ["الكتاب الثاني", "الباب الثامن", "الفصل الأول"],
      text: "من أقدم قصداً على إيذاء شخص بالضرب أو الجرح أو العنف أو أي فعل مؤذٍ آخر، ونتج عن ذلك تعطيل عن العمل مدة تزيد على عشرة أيام، عوقب بالحبس من ثلاثة أشهر إلى سنتين.",
      status: ArticleStatus.Regular,
    },
    {
      id: "art-241",
      articleNumber: "المادة 241",
      lawName: "قانون العقوبات السوري",
      hierarchy: ["الكتاب الأول", "الباب الخامس"],
      text: "تُخفَّض العقوبة وفقاً للأسباب المخففة التقديرية التي تستظهرها المحكمة من ظروف الجريمة وسوابق المحكوم عليه ودوافعه.",
      status: ArticleStatus.Amended,
    },
    {
      id: "art-489",
      articleNumber: "المادة 489",
      lawName: "قانون العقوبات السوري",
      hierarchy: ["الكتاب الثاني", "الباب السابع"],
      text: "نص ملغى بموجب المرسوم التشريعي رقم 1 لعام 2011، ويبقى قابلاً للاطلاع لأغراض البحث دون أن يكون نافذاً.",
      status: ArticleStatus.Repealed,
    },
  ],
  precedents: [
    {
      id: "case-2019-441",
      title: "إيذاء مقصود أفضى إلى تعطيل عن العمل",
      caseNumber: "أساس 441 / قرار 318 لعام 2019",
      category: CaseCategory.Criminal,
      date: "2019-06-14",
      summary:
        "قضت المحكمة بإدانة المدعى عليه بجنحة الإيذاء المقصود وحبسه ستة أشهر، مع منحه الأسباب المخففة التقديرية لعدم وجود سوابق.",
    },
    {
      id: "case-2021-102",
      title: "نزاع أفضى إلى اعتداء متبادل",
      caseNumber: "أساس 102 / قرار 87 لعام 2021",
      category: CaseCategory.Criminal,
      date: "2021-02-03",
      summary:
        "اعتبرت المحكمة أن الاعتداء المتبادل ينفي حالة الدفاع المشروع، وأدانت الطرفين بجنحة الإيذاء كل بحسب فعله.",
    },
    {
      id: "case-2022-655",
      title: "دفع بالدفاع المشروع في جرم إيذاء",
      caseNumber: "أساس 655 / قرار 512 لعام 2022",
      category: CaseCategory.Criminal,
      date: "2022-11-27",
      summary:
        "ردّت المحكمة الدفع بالدفاع المشروع لانتفاء شرط الخطر الحالّ، وأيدت الإدانة مع تخفيض العقوبة.",
    },
  ],
};

const MOCK_NO_MATCH: RulingResult = {
  matched: false,
  ruling: "",
  confidence: 0.11,
  explanation: "",
  legalBasis: [],
  precedents: [],
};

/**
 * Lets us exercise the no-match screen without a backend: a description with no
 * Arabic letters could not plausibly retrieve anything from an Arabic corpus.
 * Type 40+ Latin characters to see that state.
 */
const looksRetrievable = (description: string) => /[\u0600-\u06FF]/.test(description);

export async function mockGenerateRuling(
  payload: GenerateRulingDto,
): Promise<ApiResponse<RulingResult>> {
  await delay(MOCK_GENERATE_DELAY_MS);

  return {
    data: looksRetrievable(payload.description) ? MOCK_RULING : MOCK_NO_MATCH,
    succeeded: true,
  };
}

export async function mockExtractDocumentText(
  file: File,
): Promise<ApiResponse<ExtractedDocument>> {
  await delay(MOCK_EXTRACT_DELAY_MS);

  return {
    data: {
      text:
        `[نص مستخرج من الملف: ${file.name}]\n\n` +
        "بتاريخ 12/03/2023 وقع خلاف بين الطرفين انتهى باعتداء أحدهما على الآخر بالضرب، " +
        "ونتج عن الاعتداء رضوض موثقة بتقرير طبي أفاد بتعطيل عن العمل لمدة أربعة عشر يوماً. " +
        "لا توجد سوابق قضائية بحق المعتدي، وينكر الأخير قصد الإيذاء ويدفع بأنه كان يدافع عن نفسه.",
    },
    succeeded: true,
  };
}
