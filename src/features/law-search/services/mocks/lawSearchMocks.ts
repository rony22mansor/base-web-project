/**
 * TEMPORARY mock data — replace with the real Python backend.
 *
 * Everything here is invented for UI development. The Arabic legal text below
 * is NOT authoritative and must not be treated as real law. Delete this file
 * (and the USE_MOCKS branch in lawSearchService) once the backend is live;
 * nothing outside the service layer imports it.
 */
import { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import type { PagedResult } from "@/src/core/types/pagination";
import type { LawSearchParams } from "../../types/dtos";
import type {
  LawArticle,
  LawCategory,
} from "../../types/interfaces/lawInterface";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const MOCK_BROWSE_DELAY_MS = 650;
/** Semantic retrieval is slower than a plain list — reflect that in the UI. */
const MOCK_SEARCH_DELAY_MS = 1400;

const LAW_PENAL = "law-penal";
const LAW_CIVIL = "law-civil";
const LAW_COMMERCE = "law-commerce";

const MOCK_CATEGORIES: LawCategory[] = [
  { id: LAW_PENAL, name: "قانون العقوبات السوري", articleCount: 7 },
  { id: LAW_CIVIL, name: "القانون المدني السوري", articleCount: 4 },
  { id: LAW_COMMERCE, name: "قانون التجارة السوري", articleCount: 3 },
];

const MOCK_ARTICLES: LawArticle[] = [
  {
    id: "art-540",
    articleNumber: "المادة 540",
    title: "الإيذاء المقصود المفضي إلى تعطيل عن العمل",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الثاني", "الباب الثامن", "الفصل الأول"],
    text: "من أقدم قصداً على إيذاء شخص بالضرب أو الجرح أو العنف أو أي فعل مؤذٍ آخر، ونتج عن ذلك تعطيل عن العمل مدة تزيد على عشرة أيام، عوقب بالحبس من ثلاثة أشهر إلى سنتين.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-241",
    articleNumber: "المادة 241",
    title: "الأسباب المخففة التقديرية",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الأول", "الباب الخامس"],
    text: "تُخفَّض العقوبة وفقاً للأسباب المخففة التقديرية التي تستظهرها المحكمة من ظروف الجريمة وسوابق المحكوم عليه ودوافعه.",
    status: ArticleStatus.Amended,
  },
  {
    id: "art-489",
    articleNumber: "المادة 489",
    title: "نص ملغى",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الثاني", "الباب السابع"],
    text: "نص ملغى بموجب المرسوم التشريعي رقم 1 لعام 2011، ويبقى قابلاً للاطلاع لأغراض البحث دون أن يكون نافذاً.",
    status: ArticleStatus.Repealed,
  },
  {
    id: "art-533",
    articleNumber: "المادة 533",
    title: "القتل القصد",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الثاني", "الباب الثامن", "الفصل الأول"],
    text: "من قتل نفساً عمداً عوقب بالأشغال الشاقة المؤبدة، ما لم تتوافر ظروف تشدد العقوبة أو تخففها وفق أحكام هذا القانون.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-183",
    articleNumber: "المادة 183",
    title: "الدفاع المشروع",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الأول", "الباب الرابع"],
    text: "لا يُعدّ جريمة الفعل الذي يفرضه الدفاع المشروع عن النفس أو المال، بشرط أن يكون الخطر حالّاً وأن يكون الدفاع متناسباً مع جسامة الاعتداء.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-621",
    articleNumber: "المادة 621",
    title: "السرقة الموصوفة",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الثاني", "الباب العاشر", "الفصل الثاني"],
    text: "يُعاقب بالحبس من سنة إلى ثلاث سنوات كل من سرق مالاً منقولاً مملوكاً للغير إذا اقترنت السرقة بظرف من ظروف التشديد المنصوص عليها في هذا الفصل.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-655",
    articleNumber: "المادة 655",
    title: "إساءة الأمانة",
    lawName: "قانون العقوبات السوري",
    lawId: LAW_PENAL,
    hierarchy: ["الكتاب الثاني", "الباب العاشر", "الفصل الرابع"],
    text: "من كُلّف بمال منقول على سبيل الأمانة فتصرف به تصرف المالك أو امتنع عن ردّه، عوقب بالحبس من شهرين إلى سنتين.",
    status: ArticleStatus.Amended,
  },
  {
    id: "art-164",
    articleNumber: "المادة 164",
    title: "المسؤولية عن الفعل الضار",
    lawName: "القانون المدني السوري",
    lawId: LAW_CIVIL,
    hierarchy: ["الكتاب الأول", "الباب الأول", "الفصل الثالث"],
    text: "كل خطأ سبب ضرراً للغير يلزم من ارتكبه بالتعويض، ويُقدَّر التعويض بقدر ما لحق المتضرر من خسارة وما فاته من كسب.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-148",
    articleNumber: "المادة 148",
    title: "القوة الملزمة للعقد",
    lawName: "القانون المدني السوري",
    lawId: LAW_CIVIL,
    hierarchy: ["الكتاب الأول", "الباب الأول", "الفصل الثاني"],
    text: "العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين أو للأسباب التي يقررها القانون، ويجب تنفيذه بحسن نية.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-536",
    articleNumber: "المادة 536",
    title: "التزامات المؤجر",
    lawName: "القانون المدني السوري",
    lawId: LAW_CIVIL,
    hierarchy: ["الكتاب الثاني", "الباب الثاني", "الفصل الأول"],
    text: "يلتزم المؤجر بتسليم المأجور بالحالة التي يكون عليها وقت العقد، وبصيانته بما يبقيه صالحاً للانتفاع المقصود طوال مدة الإجارة.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-231",
    articleNumber: "المادة 231",
    title: "التقادم المسقط",
    lawName: "القانون المدني السوري",
    lawId: LAW_CIVIL,
    hierarchy: ["الكتاب الأول", "الباب الرابع"],
    text: "نص ملغى واستُعيض عنه بأحكام المرسوم التشريعي الناظم لمدد التقادم، ويبقى مرجعاً تاريخياً للبحث دون أثر نافذ.",
    status: ArticleStatus.Repealed,
  },
  {
    id: "art-c-19",
    articleNumber: "المادة 19",
    title: "تعريف العمل التجاري",
    lawName: "قانون التجارة السوري",
    lawId: LAW_COMMERCE,
    hierarchy: ["الباب الأول", "الفصل الأول"],
    text: "تُعدّ أعمالاً تجارية الأعمال التي يقوم بها التاجر لحاجات تجارته، وكل عمل يقصد به المضاربة على فرق السعر في شراء البضائع وبيعها.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-c-84",
    articleNumber: "المادة 84",
    title: "الشركة التضامنية",
    lawName: "قانون التجارة السوري",
    lawId: LAW_COMMERCE,
    hierarchy: ["الباب الثالث", "الفصل الأول"],
    text: "الشركة التضامنية شركة تؤلَّف بين شريكين أو أكثر ويكون كل منهم مسؤولاً بالتضامن وفي جميع أمواله عن ديون الشركة والتزاماتها.",
    status: ArticleStatus.Regular,
  },
  {
    id: "art-c-212",
    articleNumber: "المادة 212",
    title: "الشيك بدون رصيد",
    lawName: "قانون التجارة السوري",
    lawId: LAW_COMMERCE,
    hierarchy: ["الباب السادس", "الفصل الثالث"],
    text: "يُعاقب بالحبس وبالغرامة كل من أصدر شيكاً ليس له مقابل وفاء قائم وقابل للسحب، أو استرد الرصيد بعد إصدار الشيك.",
    status: ArticleStatus.Amended,
  },
];

/** Naive token overlap — stands in for the backend embedding similarity. */
const scoreAgainstQuery = (article: LawArticle, query: string): number => {
  const tokens = query
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return 0;

  const haystack =
    `${article.title} ${article.text} ${article.lawName} ${article.articleNumber}`.toLowerCase();
  const hits = tokens.filter((token) =>
    haystack.includes(token.toLowerCase()),
  ).length;

  return hits / tokens.length;
};

/**
 * Below this a match is treated as no match. CLAUDE_monsif.md wants retrieval
 * to be strict rather than return loosely related articles, so a query that
 * hits nothing yields an empty grid instead of filler.
 */
const MIN_SCORE = 0.34;

export async function mockSearchLawArticles(
  params: LawSearchParams,
): Promise<ApiResponse<PagedResult<LawArticle>>> {
  const query = params.query?.trim() ?? "";
  await delay(query ? MOCK_SEARCH_DELAY_MS : MOCK_BROWSE_DELAY_MS);

  let matches = MOCK_ARTICLES.filter(
    (article) =>
      (!params.lawId || article.lawId === params.lawId) &&
      (!params.status || article.status === params.status),
  );

  if (query) {
    matches = matches
      .map((article) => ({
        ...article,
        score: scoreAgainstQuery(article, query),
      }))
      .filter((article) => (article.score ?? 0) >= MIN_SCORE)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
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

export async function mockGetLawCategories(): Promise<
  ApiResponse<LawCategory[]>
> {
  await delay(300);
  return { data: MOCK_CATEGORIES, succeeded: true };
}
