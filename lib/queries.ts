import { getSupabaseAnon } from "./supabase";

export interface JobPostingRow {
  source: "SARAMIN" | "JOBKOREA";
  title: string;
  url: string;
  status: "ACTIVE" | "CLOSED";
  dday: string | null;
}

export interface ActiveJobPostingGroup {
  studioName: string;
  postings: JobPostingRow[];
}

/** 전체 제작사의 현재 진행중인 채용공고 */
export async function getActiveJobPostingsByStudio(): Promise<ActiveJobPostingGroup[]> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("studio_job_postings")
    .select("studio_name,source,title,url,status,dday")
    .eq("status", "ACTIVE")
    .order("studio_name", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as (JobPostingRow & { studio_name: string })[];

  const groups = new Map<string, JobPostingRow[]>();
  for (const row of rows) {
    const list = groups.get(row.studio_name) ?? [];
    list.push({ source: row.source, title: row.title, url: row.url, status: row.status, dday: row.dday });
    groups.set(row.studio_name, list);
  }
  return [...groups.entries()].map(([studioName, postings]) => ({ studioName, postings }));
}
