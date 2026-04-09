import { PageSection } from "@/core/shared/section-types";
import { SectionRenderer } from "../section-renderer";

interface Props {
  section: PageSection;
}

export function SectionPreview({ section }: Props) {
  return (
    <div className="pointer-events-none select-none overflow-hidden rounded-b-2xl border-t border-dashed border-violet-300 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="scale-90 origin-top">
        <SectionRenderer section={section} />
      </div>
    </div>
  );
}
