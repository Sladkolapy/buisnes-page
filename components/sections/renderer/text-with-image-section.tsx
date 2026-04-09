import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

export function TextWithImageSection({ settings }: Props) {
  const isRight = settings.imagePosition !== "left";

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className={`grid items-center gap-8 md:grid-cols-2 ${isRight ? "" : "md:[direction:rtl]"}`}>
          <div className={isRight ? "" : "md:[direction:ltr]"}>
            {settings.title && (
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
            )}
            {settings.text && (
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{settings.text}</p>
            )}
          </div>

          {settings.imageUrl ? (
            <div className={isRight ? "" : "md:[direction:ltr]"}>
              <img src={settings.imageUrl} alt={settings.title ?? ""} className="w-full rounded-2xl object-cover shadow-lg" style={{ maxHeight: 400 }} />
            </div>
          ) : (
            <div className={`flex h-48 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 ${isRight ? "" : "md:[direction:ltr]"}`}>
              <span className="text-4xl">🖼️</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
