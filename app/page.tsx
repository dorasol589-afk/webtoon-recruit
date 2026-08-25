import { getActiveJobPostingsByStudio, getKeywordJobPostings } from "@/lib/queries";
import RecruitSearch from "./RecruitSearch";
import KeywordJobList from "./KeywordJobList";

export const dynamic = "force-dynamic";

const RECRUIT_KEYWORDS = ["웹툰PD"];

export default async function RecruitPage() {
  let groups: Awaited<ReturnType<typeof getActiveJobPostingsByStudio>> = [];
  let keywordResults: { keyword: string; postings: Awaited<ReturnType<typeof getKeywordJobPostings>> }[] = [];
  let loadError = false;
  try {
    const [groupsResult, ...keywordPostingsResults] = await Promise.all([
      getActiveJobPostingsByStudio(),
      ...RECRUIT_KEYWORDS.map((k) => getKeywordJobPostings(k)),
    ]);
    groups = groupsResult;
    keywordResults = RECRUIT_KEYWORDS.map((keyword, i) => ({ keyword, postings: keywordPostingsResults[i] }));
  } catch (err) {
    console.error("채용공고 조회 실패:", err);
    loadError = true;
  }

  const totalCount = groups.reduce((sum, g) => sum + g.postings.length, 0);

  return (
    <div>
      <p className="mb-6 text-sm text-neutral-400">
        {!loadError && `현재 진행중인 공고 ${totalCount.toLocaleString()}건`}
      </p>

      {loadError && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase 연결 설정이 필요합니다.
        </div>
      )}

      {!loadError &&
        keywordResults.map(({ keyword, postings }) => (
          <KeywordJobList key={keyword} keyword={keyword} postings={postings} />
        ))}

      {!loadError && <RecruitSearch groups={groups} />}
    </div>
  );
}
