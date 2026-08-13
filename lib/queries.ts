import { getSupabaseAnon } from "./supabase";

export interface JobPostingRow {
  source: "SARAMIN" | "JOBKOREA";
  postingId: string;
  title: string;
  url: string;
  status: "ACTIVE" | "CLOSED";
  dday: string | null;
  applied: boolean;
}

export interface ActiveJobPostingGroup {
  studioName: string;
  postings: JobPostingRow[];
}

async function getAppliedPostingKeys(): Promise<Set<string>> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.from("job_posting_applications").select("source,posting_id");
  if (error) throw error;
  return new Set((data ?? []).map((r) => `${r.source}_${r.posting_id}`));
}

/** 전체 제작사의 현재 진행중인 채용공고 */
export async function getActiveJobPostingsByStudio(): Promise<ActiveJobPostingGroup[]> {
  const supabase = getSupabaseAnon();
  const [{ data, error }, appliedKeys] = await Promise.all([
    supabase
      .from("studio_job_postings")
      .select("studio_name,source,posting_id,title,url,status,dday")
      .eq("status", "ACTIVE")
      .order("studio_name", { ascending: true }),
    getAppliedPostingKeys(),
  ]);
  if (error) throw error;
  const rows = (data ?? []) as (Omit<JobPostingRow, "postingId" | "applied"> & {
    studio_name: string;
    posting_id: string;
  })[];

  const groups = new Map<string, JobPostingRow[]>();
  for (const row of rows) {
    const list = groups.get(row.studio_name) ?? [];
    list.push({
      source: row.source,
      postingId: row.posting_id,
      title: row.title,
      url: row.url,
      status: row.status,
      dday: row.dday,
      applied: appliedKeys.has(`${row.source}_${row.posting_id}`),
    });
    groups.set(row.studio_name, list);
  }
  return [...groups.entries()].map(([studioName, postings]) => ({ studioName, postings }));
}

/** 채용공고 지원 여부 토글(존재 = 지원함) */
export async function setJobApplied(source: string, postingId: string, applied: boolean): Promise<void> {
  const supabase = getSupabaseAnon();
  if (applied) {
    const { error } = await supabase
      .from("job_posting_applications")
      .upsert({ source, posting_id: postingId }, { onConflict: "source,posting_id" });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("job_posting_applications")
      .delete()
      .eq("source", source)
      .eq("posting_id", postingId);
    if (error) throw error;
  }
}
