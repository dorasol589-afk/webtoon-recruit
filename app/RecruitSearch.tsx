"use client";

import { useMemo, useState } from "react";
import type { ActiveJobPostingGroup } from "@/lib/queries";

const SOURCE_LABEL: Record<string, string> = {
  SARAMIN: "사람인",
  JOBKOREA: "잡코리아",
};

export default function RecruitSearch({ groups }: { groups: ActiveJobPostingGroup[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        studioName: g.studioName,
        postings: g.postings.filter(
          (p) => g.studioName.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.postings.length > 0);
  }, [groups, query]);

  const filteredCount = filtered.reduce((sum, g) => sum + g.postings.length, 0);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제작사명 또는 공고 제목으로 검색..."
        className="mb-6 w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
      />

      {query && <p className="mb-4 text-sm text-neutral-400">{filteredCount.toLocaleString()}건 검색됨</p>}

      {filteredCount === 0 && (
        <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
          {query ? "검색 결과가 없습니다." : "현재 진행중인 공고가 없습니다."}
        </p>
      )}

      {filteredCount > 0 && (
        <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
          {filtered.map((g) =>
            g.postings.map((p, i) => (
              <li key={`${g.studioName}-${i}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-neutral-400">{g.studioName}</span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-600 hover:underline"
                  >
                    {p.title}
                  </a>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {p.dday && <span className="text-xs text-neutral-400">{p.dday}</span>}
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {SOURCE_LABEL[p.source] ?? p.source}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
