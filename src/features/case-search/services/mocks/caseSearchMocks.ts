/**
 * TEMPORARY mock data — replace with the real Python backend.
 *
 * Everything here is invented for UI development. The Arabic case text below is
 * NOT real case law and must not be treated as authoritative. Delete this file
 * (and the USE_MOCKS branch in caseSearchService) once the backend is live;
 * nothing outside the service layer imports it.
 */
import { CaseCategory } from "@/src/core/enums/legalDomain";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import type { PagedResult } from "@/src/core/types/pagination";
import type { CaseSearchParams } from "../../types/dtos";
import type {
  CaseCategoryCount,
  LegalCase,
} from "../../types/interfaces/caseInterface";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const MOCK_BROWSE_DELAY_MS = 650;
/** Semantic retrieval is slower than a plain list — reflect that in the UI. */
const MOCK_SEARCH_DELAY_MS = 1400;

const MOCK_CASES: LegalCase[] = [
  {
    id: "case-2019-441",
    title: "إيذاء مقصود أفضى إلى تعطيل عن العمل",
    caseNumber: "أساس 441 / قرار 318 لعام 2019",
    category: CaseCategory.Criminal,
    court: "محكمة الجزاء بدمشق",
    date: "2019-06-14",
    summary:
      "تخاصم الطرفان على خلفية نزاع جوار، فأقدم المدعى عليه على ضرب المشتكي بآلة راضة، ونتج عن الاعتداء تعطيل عن العمل مدة أربعة عشر يوماً موثقة بتقرير طبي.",
    ruling:
      "قضت المحكمة بإدانة المدعى عليه بجنحة الإيذاء المقصود وحبسه ستة أشهر، مع منحه الأسباب المخففة التقديرية لعدم وجود سوابق قضائية بحقه.",
    citedArticles: ["المادة 540", "المادة 241"],
  },
  {
    id: "case-2021-102",
    title: "نزاع أفضى إلى اعتداء متبادل",
    caseNumber: "أساس 102 / قرار 87 لعام 2021",
    category: CaseCategory.Criminal,
    court: "محكمة الجزاء بحلب",
    date: "2021-02-03",
    summary:
      "تبادل الطرفان الاعتداء إثر خلاف تجاري، وأصيب كلاهما بأذى جسدي متفاوت الجسامة، ودفع كل منهما بأنه كان في حالة دفاع مشروع.",
    ruling:
      "اعتبرت المحكمة أن الاعتداء المتبادل ينفي حالة الدفاع المشروع، وأدانت الطرفين بجنحة الإيذاء كل بحسب فعله.",
    citedArticles: ["المادة 540", "المادة 183"],
  },
  {
    id: "case-2022-655",
    title: "دفع بالدفاع المشروع في جرم إيذاء",
    caseNumber: "أساس 655 / قرار 512 لعام 2022",
    category: CaseCategory.Criminal,
    court: "محكمة النقض — الغرفة الجزائية",
    date: "2022-11-27",
    summary:
      "دفع الطاعن بأن فعله كان دفاعاً مشروعاً عن نفسه بعد أن هدده المشتكي، إلا أن التهديد لم يقترن بخطر حالّ وقت وقوع الفعل.",
    ruling:
      "ردّت المحكمة الدفع بالدفاع المشروع لانتفاء شرط الخطر الحالّ، وأيدت الإدانة مع تخفيض العقوبة.",
    citedArticles: ["المادة 183", "المادة 241"],
  },
  {
    id: "case-2018-207",
    title: "سرقة موصوفة بظرف الليل والتعدد",
    caseNumber: "أساس 207 / قرار 155 لعام 2018",
    category: CaseCategory.Criminal,
    court: "محكمة الجزاء بحمص",
    date: "2018-09-02",
    summary:
      "أقدم ثلاثة أشخاص ليلاً على كسر باب مستودع والاستيلاء على بضائع، وضُبط أحدهم متلبساً بينما فرّ الآخران.",
    ruling:
      "أدانت المحكمة المضبوط بجرم السرقة الموصوفة وحكمت عليه بالحبس سنتين، وتقرر ملاحقة الفارّين.",
    citedArticles: ["المادة 621"],
  },
  {
    id: "case-2020-318",
    title: "فسخ عقد إيجار للإخلال بالصيانة",
    caseNumber: "أساس 318 / قرار 244 لعام 2020",
    category: CaseCategory.Civil,
    court: "محكمة البداية المدنية بدمشق",
    date: "2020-04-19",
    summary:
      "طلب المستأجر فسخ العقد لامتناع المؤجر عن إجراء الإصلاحات الجوهرية التي جعلت المأجور غير صالح للانتفاع المقصود.",
    ruling:
      "قضت المحكمة بفسخ عقد الإجارة وإلزام المؤجر بإعادة بدل الإيجار عن المدة غير المنتفع بها مع التعويض.",
    citedArticles: ["المادة 536", "المادة 148"],
  },
  {
    id: "case-2021-489",
    title: "تعويض عن ضرر ناتج عن فعل ضار",
    caseNumber: "أساس 489 / قرار 371 لعام 2021",
    category: CaseCategory.Civil,
    court: "محكمة الاستئناف المدنية بحلب",
    date: "2021-10-11",
    summary:
      "تسبب إهمال المدعى عليه في إتلاف بضاعة المدعي المخزّنة، وطالب المدعي بالتعويض عن الخسارة وعن الكسب الفائت.",
    ruling:
      "ألزمت المحكمة المدعى عليه بالتعويض عن الخسارة اللاحقة والكسب الفائت بعد تقديرهما بواسطة خبرة فنية.",
    citedArticles: ["المادة 164"],
  },
  {
    id: "case-2017-96",
    title: "نزاع على تنفيذ عقد بيع عقاري",
    caseNumber: "أساس 96 / قرار 71 لعام 2017",
    category: CaseCategory.Civil,
    court: "محكمة البداية المدنية باللاذقية",
    date: "2017-03-28",
    summary:
      "امتنع البائع عن نقل الملكية بعد قبض كامل الثمن، ودفع بأن العقد باطل لعيب في الرضا لم يقم عليه دليل.",
    ruling:
      "قضت المحكمة بإلزام البائع بتنفيذ العقد عيناً ونقل الملكية، ورفضت الدفع بالبطلان.",
    citedArticles: ["المادة 148"],
  },
  {
    id: "case-2023-77",
    title: "شيك بدون رصيد في معاملة تجارية",
    caseNumber: "أساس 77 / قرار 59 لعام 2023",
    category: CaseCategory.Commercial,
    court: "محكمة البداية التجارية بدمشق",
    date: "2023-05-08",
    summary:
      "حرّر المدعى عليه شيكاً وفاءً لثمن بضاعة، وارتد الشيك لعدم كفاية الرصيد، ثم امتنع عن السداد رغم الإنذار.",
    ruling:
      "أدانت المحكمة الساحب بجرم إصدار شيك بدون رصيد وألزمته بقيمة الشيك والفوائد القانونية.",
    citedArticles: ["المادة 212"],
  },
  {
    id: "case-2019-620",
    title: "حل شركة تضامنية ومسؤولية الشركاء",
    caseNumber: "أساس 620 / قرار 480 لعام 2019",
    category: CaseCategory.Commercial,
    court: "محكمة الاستئناف التجارية بحلب",
    date: "2019-12-01",
    summary:
      "طلب أحد الشركاء حل الشركة التضامنية للخلاف المستحكم، ونازع الشركاء في مدى مسؤوليتهم عن ديونها.",
    ruling:
      "قضت المحكمة بحل الشركة وتصفيتها، وقررت مسؤولية الشركاء بالتضامن وفي جميع أموالهم عن ديون الشركة.",
    citedArticles: ["المادة 84"],
  },
  {
    id: "case-2016-15",
    title: "تكييف عمل بأنه عمل تجاري",
    caseNumber: "أساس 15 / قرار 12 لعام 2016",
    category: CaseCategory.Commercial,
    court: "محكمة النقض — الغرفة التجارية",
    date: "2016-01-21",
    summary:
      "نازع الطاعن في اختصاص المحكمة التجارية بحجة أن الصفقة عمل مدني لا تجاري ولا تقصد المضاربة على فرق السعر.",
    ruling:
      "قررت المحكمة أن الشراء بقصد إعادة البيع عمل تجاري بطبيعته، وأيدت اختصاص المحكمة التجارية.",
    citedArticles: ["المادة 19"],
  },
  {
    id: "case-2022-330",
    title: "إساءة أمانة في مال مسلّم للحفظ",
    caseNumber: "أساس 330 / قرار 261 لعام 2022",
    category: CaseCategory.Criminal,
    court: "محكمة الجزاء بطرطوس",
    date: "2022-07-16",
    summary:
      "سُلّمت للمدعى عليه بضاعة على سبيل الأمانة لحفظها، فتصرف بها بالبيع وامتنع عن ردّها أو ردّ ثمنها.",
    ruling:
      "أدانت المحكمة المدعى عليه بجرم إساءة الأمانة وحكمت عليه بالحبس ثمانية أشهر مع الإلزام بالرد.",
    citedArticles: ["المادة 655"],
  },
  {
    id: "case-2009-58",
    title: "خلاف قديم على تنفيذ التزام تعاقدي",
    caseNumber: "أساس 58 / قرار 40 لعام 2009",
    category: CaseCategory.Civil,
    court: "محكمة البداية المدنية بحماة",
    date: "2009-11-05",
    summary:
      "دعوى قديمة حول الإخلال بالتزام تعاقدي، أُدرجت هنا لاختبار مرشّح المدى الزمني الأقدم في الواجهة.",
    ruling:
      "قضت المحكمة بإلزام المدعى عليه بتنفيذ التزامه التعاقدي مع التعويض عن التأخير.",
    citedArticles: ["المادة 148"],
  },
];

/** Naive token overlap — stands in for the backend embedding similarity. */
const scoreAgainstQuery = (legalCase: LegalCase, query: string): number => {
  const tokens = query
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return 0;

  const haystack =
    `${legalCase.title} ${legalCase.summary} ${legalCase.ruling} ${legalCase.court}`.toLowerCase();
  const hits = tokens.filter((token) =>
    haystack.includes(token.toLowerCase()),
  ).length;

  return hits / tokens.length;
};

/** Strict retrieval: a query that hits nothing yields an empty grid. */
const MIN_SCORE = 0.34;

export async function mockSearchCases(
  params: CaseSearchParams,
): Promise<ApiResponse<PagedResult<LegalCase>>> {
  const query = params.query?.trim() ?? "";
  await delay(query ? MOCK_SEARCH_DELAY_MS : MOCK_BROWSE_DELAY_MS);

  let matches = MOCK_CASES.filter(
    (legalCase) =>
      (!params.category || legalCase.category === params.category) &&
      (!params.dateFrom || legalCase.date >= params.dateFrom) &&
      (!params.dateTo || legalCase.date < params.dateTo),
  );

  if (query) {
    matches = matches
      .map((legalCase) => ({
        ...legalCase,
        score: scoreAgainstQuery(legalCase, query),
      }))
      .filter((legalCase) => (legalCase.score ?? 0) >= MIN_SCORE)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    // Newest first while browsing.
    matches = [...matches].sort((a, b) => b.date.localeCompare(a.date));
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

export async function mockGetCaseCategories(): Promise<
  ApiResponse<CaseCategoryCount[]>
> {
  await delay(300);

  const counts = Object.values(CaseCategory).map((category) => ({
    category,
    count: MOCK_CASES.filter((legalCase) => legalCase.category === category)
      .length,
  }));

  return { data: counts, succeeded: true };
}
