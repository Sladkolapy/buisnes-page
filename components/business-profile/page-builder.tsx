"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  ImageIcon, User, Palette, LayoutGrid, Globe, ChevronDown, ChevronRight,
  Eye, EyeOff, GripVertical, Pencil, Trash2, Plus, Save, Check,
  ExternalLink, Loader2, Columns2, Square, ImagePlus, AlertCircle, Monitor,
} from "lucide-react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { WidgetEditor } from "./widget-editor";
import { WidgetType, WIDGET_LABELS, type WidgetData } from "@/core/shared/widget-types";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const BG_SHADES = [
  { s: 10, l: 100 }, { s: 20, l: 98 }, { s: 40, l: 95 }, { s: 60, l: 91 },
  { s: 70, l: 86 }, { s: 78, l: 78 }, { s: 82, l: 66 }, { s: 80, l: 50 },
  { s: 65, l: 28 }, { s: 30, l: 14 },
];

const ACCENT_SHADES = [
  { s: 90, l: 92 }, { s: 90, l: 80 }, { s: 92, l: 68 }, { s: 93, l: 56 },
  { s: 90, l: 44 }, { s: 87, l: 35 }, { s: 82, l: 27 }, { s: 74, l: 20 },
  { s: 40, l: 32 }, { s: 8, l: 14 },
];

const HUE_GRADIENT = [
  "hsl(0,100%,50%)", "hsl(30,100%,50%)", "hsl(60,100%,50%)", "hsl(90,100%,50%)",
  "hsl(120,100%,50%)", "hsl(150,100%,50%)", "hsl(180,100%,50%)", "hsl(210,100%,50%)",
  "hsl(240,100%,50%)", "hsl(270,100%,50%)", "hsl(300,100%,50%)", "hsl(330,100%,50%)",
  "hsl(360,100%,50%)",
].join(",");

function HuePicker({ label, value, onChange, mode }: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  mode: "bg" | "accent";
}) {
  const [hue, setHue] = useState(() => hexToHsl(value.startsWith("#") && value.length === 7 ? value : "#7c3aed")[0]);

  useEffect(() => {
    if (value.startsWith("#") && value.length === 7) {
      const [h] = hexToHsl(value);
      setHue(h);
    }
  }, [value]);

  const shadeParams = mode === "bg" ? BG_SHADES : ACCENT_SHADES;
  const swatches = shadeParams.map(({ s, l }) => hslToHex(hue, s, l));

  return (
    <div className="space-y-3">
      <>
        <style>{`
          .hue-range { -webkit-appearance: none; appearance: none; height: 14px;
            border-radius: 999px; outline: none; cursor: pointer; width: 100%; }
          .hue-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
            width: 22px; height: 22px; border-radius: 50%; background: white;
            border: 3px solid rgba(0,0,0,0.3); box-shadow: 0 1px 4px rgba(0,0,0,0.25); cursor: pointer; }
          .hue-range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%;
            background: white; border: 3px solid rgba(0,0,0,0.3); cursor: pointer; }
        `}</style>
      </>
      <p className="text-xs font-medium text-zinc-500">{label}</p>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 shadow-sm" style={{ backgroundColor: value }} />
        <span className="font-mono text-xs text-zinc-500">{value}</span>
        <input
          type="color" value={value.startsWith("#") && value.length === 7 ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          title="Произвольный цвет"
          className="ml-auto h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
        />
      </div>

      <input
        type="range" min={0} max={360} value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="hue-range"
        style={{ background: `linear-gradient(to right, ${HUE_GRADIENT})` }}
      />

      <div className="flex gap-1.5">
        {swatches.map((sw) => (
          <button
            key={sw}
            title={sw}
            onClick={() => onChange(sw)}
            style={{ backgroundColor: sw }}
            className={`h-8 flex-1 rounded-lg border-2 transition-all hover:scale-105 ${
              sw.toLowerCase() === value.toLowerCase()
                ? "border-zinc-800 dark:border-white scale-95 shadow-md"
                : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const WIDGET_DESCRIPTIONS: Record<string, string> = {
  ABOUT: "Текст о вас, вашем опыте и услугах",
  GALLERY: "Фотографии ваших работ с просмотром в лайтбоксе",
  CHECKLIST: "Список услуг, преимуществ или правил визита",
  MAP: "Ваш адрес с картой — клиент сразу знает, как добраться",
  SOCIAL: "Ссылки на Instagram, Telegram, ВКонтакте, WhatsApp",
  NEWS: "Акции, спецпредложения и важные объявления",
  REVIEWS: "Отзывы клиентов — вскоре будет доступно",
  PRICE_LIST: "Цены на услуги — первые 3 строки видны в ленте поиска",
};

function Section({
  icon, title, badge, defaultOpen = false,
  children,
}: {
  icon: React.ReactNode; title: string; badge?: string;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/40">
          {icon}
        </span>
        <span className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
        {badge && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
            {badge}
          </span>
        )}
        {open ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
      </button>
      {open && <div className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">{children}</div>}
    </div>
  );
}

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  const { profile, setProfile, saveProfile, isLoading } = useBusinessProfileStore();

  async function togglePublish() {
    if (!profile) return;
    setProfile({ ...profile, isPublished: !profile.isPublished });
    await saveProfile();
  }

  return (
    <div className="sticky top-14 z-20 -mx-4 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/90">
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Конструктор страницы</p>
        <p className="text-xs text-zinc-400">Изменения сохраняются вручную</p>
      </div>
      {profile?.subdomain && (
        <a
          href={`/my-page/preview`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 sm:flex"
        >
          <Monitor className="h-4 w-4" />
          Превью
        </a>
      )}
      <div className="flex items-center gap-2">
        {profile && (
          <button
            onClick={() => void togglePublish()}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
              profile.isPublished
                ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                : "border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/30"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${profile.isPublished ? "bg-green-500" : "bg-zinc-300"}`} />
            {profile.isPublished ? "Онлайн" : "Опубликовать"}
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Сохранено!" : saving ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

function HeroSection() {
  const { profile, setProfile } = useBusinessProfileStore();
  const [offsetY, setOffsetY] = useState(50);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error: uploadError } = useCloudinaryUpload("backgrounds");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const result = await upload(file);
    if (result) setProfile({ ...profile, backgroundUrl: result.secure_url });
    if (fileRef.current) fileRef.current.value = "";
  }

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ height: 220 }}
      >
        {profile.backgroundUrl ? (
          <>
            <img
              src={profile.backgroundUrl}
              alt="background"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `center ${offsetY}%` }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 40%, white 100%)" }}
            />
            <button
              onClick={() => setProfile({ ...profile, backgroundUrl: undefined })}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              title="Удалить фон"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-400">Фоновое фото не загружено</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {uploading ? "Загружаем…" : profile.backgroundUrl ? "Заменить фото" : "Загрузить фото"}
        </button>
      </div>

      {profile.backgroundUrl && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-zinc-500">Положение фото по вертикали</p>
          <input
            type="range" min={0} max={100} value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Верх</span><span>Центр</span><span>Низ</span>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Ошибка загрузки: {uploadError}</span>
        </div>
      )}
      <p className="text-xs text-zinc-400">Поддерживаются JPG, PNG, WebP. Оптимально — 1920×600 px.</p>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(e)} />
    </div>
  );
}

function ProfileSection() {
  const { profile, setProfile } = useBusinessProfileStore();
  const { upload: uploadAvatar, uploading, error: uploadError } = useCloudinaryUpload("avatars");
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(profile?.name ?? "");
  const [descVal, setDescVal] = useState(profile?.description ?? "");

  if (!profile) return null;

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const result = await uploadAvatar(file);
    if (result) setProfile({ ...profile, avatarUrl: result.secure_url });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-600 dark:bg-violet-950/40">
              {profile.name[0]?.toUpperCase()}
            </div>
          )}
          <label className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void handleAvatar(e)} />
          </label>
        </div>
        <div className="flex-1 space-y-1">
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="flex-1 rounded-lg border border-violet-400 bg-transparent px-2 py-1 text-sm outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") { setProfile({ ...profile, name: nameVal }); setEditingName(false); }
                  if (e.key === "Escape") setEditingName(false);
                }}
              />
              <button onClick={() => { setProfile({ ...profile, name: nameVal }); setEditingName(false); }}
                className="rounded-lg bg-violet-600 px-2 py-1 text-xs text-white">✓</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{profile.name}</p>
              <button onClick={() => { setNameVal(profile.name); setEditingName(true); }}
                className="text-zinc-400 hover:text-zinc-700">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {profile.subdomain && (
            <a href={`/${profile.subdomain}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-violet-600 hover:underline">
              <Globe className="h-3 w-3" />/{profile.subdomain}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Ошибка загрузки аватара: {uploadError}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Описание / О себе</label>
        <textarea
          value={descVal}
          onChange={(e) => { setDescVal(e.target.value); setProfile({ ...profile, description: e.target.value }); }}
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
          placeholder="Коротко о вас или вашем бизнесе…"
        />
      </div>
    </div>
  );
}

function StyleSection() {
  const { profile, setProfile } = useBusinessProfileStore();
  if (!profile) return null;

  const bg = profile.bgColor ?? "#ffffff";
  const accent = profile.accentColor ?? "#7c3aed";

  return (
    <div className="space-y-6">
      <HuePicker
        label="Фон страницы"
        value={bg}
        onChange={(hex) => setProfile({ ...profile, bgColor: hex })}
        mode="bg"
      />

      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      <HuePicker
        label="Акцентный цвет (кнопки, ссылки)"
        value={accent}
        onChange={(hex) => setProfile({ ...profile, accentColor: hex })}
        mode="accent"
      />

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700" style={{ backgroundColor: bg }}>
        <p className="mb-1 text-xs text-zinc-500">Предпросмотр</p>
        <p className="text-sm font-bold" style={{ color: "#18181b" }}>{profile.name}</p>
        <button className="mt-2 rounded-lg px-3 py-1 text-xs text-white" style={{ backgroundColor: accent }}>
          Написать
        </button>
      </div>
    </div>
  );
}

function WidgetsSection() {
  const { profile, setProfile, updateWidget, removeWidget, reorderWidgets, toggleWidgetVisibility } = useBusinessProfileStore();
  const [editWidget, setEditWidget] = useState<WidgetData | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const dragIdx = useRef<number | null>(null);

  if (!profile) return null;
  const widgets = [...profile.widgets].sort((a, b) => a.position - b.position);

  function handleDragStart(idx: number) { dragIdx.current = idx; }
  function handleDrop(idx: number) {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const reordered = [...widgets];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(idx, 0, moved);
    reorderWidgets(reordered.map((w, i) => ({ ...w, position: i })));
    dragIdx.current = null;
  }

  function addWidget(type: WidgetType) {
    if (!profile) return;
    const defaults: Record<WidgetType, object> = {
      [WidgetType.ABOUT]: { text: "" },
      [WidgetType.GALLERY]: { images: [] },
      [WidgetType.CHECKLIST]: { items: [] },
      [WidgetType.MAP]: { address: "" },
      [WidgetType.SOCIAL]: {},
      [WidgetType.NEWS]: { title: "", text: "" },
      [WidgetType.REVIEWS]: {},
      [WidgetType.PRICE_LIST]: { items: [] },
    };
    const w: WidgetData = {
      id: crypto.randomUUID(),
      type,
      title: WIDGET_LABELS[type],
      content: defaults[type] as WidgetData["content"],
      position: widgets.length,
      isVisible: true,
      width: "full",
    };
    setProfile({ ...profile, widgets: [...profile.widgets, w] });
    setShowAddMenu(false);
  }

  const usedTypes = new Set(widgets.map((w) => w.type));
  const availableTypes = Object.values(WidgetType).filter((t) => !usedTypes.has(t));

  return (
    <div className="space-y-3">
      {widgets.length === 0 && (
        <p className="text-center text-sm text-zinc-400 py-4">Нет виджетов — добавьте первый</p>
      )}

      {widgets.map((widget, idx) => (
        <div
          key={widget.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(idx)}
          className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50"
        >
          <GripVertical className="h-4 w-4 cursor-grab text-zinc-300 group-hover:text-zinc-500" />

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">{widget.title}</p>
            <p className="text-xs text-zinc-400">{WIDGET_DESCRIPTIONS[widget.type] ?? WIDGET_LABELS[widget.type]}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700">
                {widget.width === "half" ? "½ ширины" : "Полная ширина"}
              </span>
              {!widget.isVisible && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">скрыт</span>}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => updateWidget(widget.id, { width: widget.width === "half" ? "full" : "half" })}
              title={widget.width === "half" ? "Переключить на полную ширину" : "Переключить на ½ ширины"}
              className={`rounded-lg p-1.5 transition ${widget.width === "half" ? "bg-violet-100 text-violet-600" : "text-zinc-400 hover:text-zinc-700"}`}
            >
              {widget.width === "half" ? <Columns2 className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => toggleWidgetVisibility(widget.id)}
              title={widget.isVisible ? "Скрыть" : "Показать"}
              className={`rounded-lg p-1.5 transition ${!widget.isVisible ? "text-zinc-300" : "text-zinc-500 hover:text-zinc-800"}`}
            >
              {widget.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setEditWidget(widget)}
              className="rounded-lg p-1.5 text-zinc-500 transition hover:text-violet-600"
              title="Редактировать"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => removeWidget(widget.id)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:text-red-500"
              title="Удалить"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}

      {availableTypes.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 py-3 text-sm text-zinc-400 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700"
          >
            <Plus className="h-4 w-4" /> Добавить виджет
          </button>
          {showAddMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid grid-cols-2 gap-1">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => addWidget(type)}
                    className="rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-300 dark:hover:bg-violet-950/20"
                  >
                    {WIDGET_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {editWidget && (
        <WidgetEditor
          widget={editWidget}
          open={!!editWidget}
          onClose={() => setEditWidget(null)}
        />
      )}
    </div>
  );
}

function PublishSection() {
  const { profile, setProfile, saveProfile, isLoading } = useBusinessProfileStore();
  if (!profile) return null;

  async function toggle() {
    if (!profile) return;
    setProfile({ ...profile, isPublished: !profile.isPublished });
    await saveProfile();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {profile.isPublished ? "Страница опубликована" : "Страница скрыта"}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            {profile.isPublished ? "Клиенты видят вашу страницу" : "Только вы видите страницу"}
          </p>
        </div>
        <button
          onClick={() => void toggle()}
          disabled={isLoading}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
            profile.isPublished
              ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {profile.isPublished ? "Снять с публикации" : "Опубликовать"}
        </button>
      </div>

      {profile.subdomain && (
        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
          <p className="mb-1 text-xs text-zinc-500">Ссылка на страницу</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300">
              {typeof window !== "undefined" ? window.location.origin : ""}/{profile.subdomain}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${profile.subdomain}`)}
              className="shrink-0 text-xs text-violet-600 hover:underline"
            >
              Копировать
            </button>
            <a
              href={`/${profile.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-zinc-400 hover:text-violet-600"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function PageBuilder() {
  const { profile, saveProfile, isLoading } = useBusinessProfileStore();
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    await saveProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [saveProfile]);

  if (!profile) return null;

  const visibleCount = profile.widgets.filter((w) => w.isVisible).length;

  return (
    <div className="space-y-3 pb-10">
      <SaveBar onSave={() => void handleSave()} saving={isLoading} saved={saved} />

      <Section icon={<ImageIcon className="h-4 w-4" />} title="Фоновое фото" defaultOpen={!profile.backgroundUrl}>
        <HeroSection />
      </Section>

      <Section icon={<User className="h-4 w-4" />} title="Профиль" defaultOpen>
        <ProfileSection />
      </Section>

      <Section icon={<Palette className="h-4 w-4" />} title="Стиль страницы" badge={profile.bgColor !== "#ffffff" ? "изменён" : undefined}>
        <StyleSection />
      </Section>

      <Section
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Виджеты"
        badge={`${visibleCount} / ${profile.widgets.length}`}
        defaultOpen
      >
        <WidgetsSection />
      </Section>

      <Section icon={<Globe className="h-4 w-4" />} title="Публикация" badge={profile.isPublished ? "онлайн" : "черновик"}>
        <PublishSection />
      </Section>
    </div>
  );
}
