"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Tags,
  Loader2,
} from "lucide-react";

interface CatRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  parentId: string | null;
}

interface FormState {
  name: string;
  slug: string;
  icon: string;
  order: string;
  parentId: string;
}

const EMPTY_FORM: FormState = { name: "", slug: "", icon: "", order: "0", parentId: "" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const role = (session?.user as { role?: string })?.role;
  useEffect(() => {
    if (status === "authenticated" && role !== "ADMIN") router.replace("/");
  }, [status, role, router]);

  const [cats, setCats] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Create form (null = closed, "" = root, id = subcategory of parentId)
  const [creating, setCreating] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<FormState>(EMPTY_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const json = (await res.json()) as { data: CatRow[] };
    setCats(json.data);
    setLoading(false);
  }

  useEffect(() => { if (role === "ADMIN") load(); }, [role]);

  const roots = cats.filter((c) => c.parentId === null).sort((a, b) => a.order - b.order);
  const children = (parentId: string) =>
    cats.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);

  function openCreate(parentId: string) {
    setCreating(parentId);
    const nextOrder =
      (parentId === ""
        ? roots.length
        : children(parentId).length);
    setCreateForm({ ...EMPTY_FORM, parentId, order: String(nextOrder) });
    setCreateError(null);
  }

  async function handleCreate() {
    setCreateLoading(true);
    setCreateError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: createForm.name,
        slug: createForm.slug || slugify(createForm.name),
        icon: createForm.icon || null,
        order: Number(createForm.order),
        parentId: createForm.parentId || null,
      }),
    });
    if (res.ok) {
      setCreating(null);
      setCreateForm(EMPTY_FORM);
      await load();
      if (createForm.parentId) setExpanded((e) => new Set([...e, createForm.parentId]));
    } else {
      const err = (await res.json()) as { error: string };
      setCreateError(typeof err.error === "string" ? err.error : "Ошибка");
    }
    setCreateLoading(false);
  }

  function openEdit(cat: CatRow) {
    setEditingId(cat.id);
    setEditForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon ?? "",
      order: String(cat.order),
      parentId: cat.parentId ?? "",
    });
    setEditError(null);
  }

  async function handleEdit() {
    if (!editingId) return;
    setEditLoading(true);
    setEditError(null);
    const res = await fetch(`/api/admin/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        slug: editForm.slug,
        icon: editForm.icon || null,
        order: Number(editForm.order),
      }),
    });
    if (res.ok) {
      setEditingId(null);
      await load();
    } else {
      const err = (await res.json()) as { error: string };
      setEditError(typeof err.error === "string" ? err.error : "Ошибка");
    }
    setEditLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = (await res.json()) as { error: string };
      alert(err.error);
    } else {
      await load();
    }
    setDeletingId(null);
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tags className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold tracking-tight">Категории</h1>
        </div>
        <button
          onClick={() => openCreate("")}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Новая категория
        </button>
      </div>

      {/* Inline create form for root */}
      {creating === "" && (
        <CreateForm
          form={createForm}
          setForm={setCreateForm}
          onSave={handleCreate}
          onCancel={() => setCreating(null)}
          loading={createLoading}
          error={createError}
          title="Новая корневая категория"
        />
      )}

      {roots.length === 0 && creating !== "" && (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-400 dark:border-zinc-700">
          Нет категорий. Создайте первую!
        </div>
      )}

      <div className="space-y-3">
        {roots.map((root) => {
          const subs = children(root.id);
          const isOpen = expanded.has(root.id);

          return (
            <div
              key={root.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            >
              {/* Root row */}
              {editingId === root.id ? (
                <div className="p-4">
                  <EditForm
                    form={editForm}
                    setForm={setEditForm}
                    onSave={handleEdit}
                    onCancel={() => setEditingId(null)}
                    loading={editLoading}
                    error={editError}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() =>
                      setExpanded((e) => {
                        const n = new Set(e);
                        n.has(root.id) ? n.delete(root.id) : n.add(root.id);
                        return n;
                      })
                    }
                    className="flex-shrink-0 rounded p-0.5 text-zinc-400 hover:text-zinc-600"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {root.icon && <span className="text-lg">{root.icon}</span>}
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{root.name}</p>
                    <p className="text-xs text-zinc-400">
                      /{root.slug} · порядок {root.order} · {subs.length} подкатегорий
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(root)}
                      className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(root.id)}
                      disabled={deletingId === root.id || subs.length > 0}
                      className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/30"
                      title={subs.length > 0 ? "Сначала удалите подкатегории" : "Удалить"}
                    >
                      {deletingId === root.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {isOpen && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                  {subs.map((sub) => (
                    <div
                      key={sub.id}
                      className="border-b border-zinc-100 last:border-none dark:border-zinc-800"
                    >
                      {editingId === sub.id ? (
                        <div className="px-6 py-3">
                          <EditForm
                            form={editForm}
                            setForm={setEditForm}
                            onSave={handleEdit}
                            onCancel={() => setEditingId(null)}
                            loading={editLoading}
                            error={editError}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 py-2.5 pl-10 pr-4">
                          {sub.icon && <span className="text-base">{sub.icon}</span>}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                              {sub.name}
                            </p>
                            <p className="text-xs text-zinc-400">
                              /{sub.slug} · порядок {sub.order}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(sub)}
                              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              disabled={deletingId === sub.id}
                              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40 dark:hover:bg-red-950/30"
                            >
                              {deletingId === sub.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Inline create subcategory form */}
                  {creating === root.id ? (
                    <div className="border-t border-zinc-100 px-6 py-3 dark:border-zinc-800">
                      <CreateForm
                        form={createForm}
                        setForm={setCreateForm}
                        onSave={handleCreate}
                        onCancel={() => setCreating(null)}
                        loading={createLoading}
                        error={createError}
                        title={`Подкатегория для «${root.name}»`}
                        compact
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => openCreate(root.id)}
                      className="flex w-full items-center gap-2 py-2.5 pl-10 pr-4 text-xs text-zinc-400 transition hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Добавить подкатегорию
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

interface FormProps {
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  title?: string;
  compact?: boolean;
}

function CreateForm({ form, setForm, onSave, onCancel, loading, error, title, compact }: FormProps) {
  return (
    <div className={`space-y-3 rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-800/40 dark:bg-violet-950/10 ${compact ? "text-sm" : ""}`}>
      {title && <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">{title}</p>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input
          autoFocus
          placeholder="Название *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
          className="col-span-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-1"
        />
        <input
          placeholder="slug *"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Иконка (эмодзи)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="number"
          placeholder="Порядок"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={loading || !form.name.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Сохранить
        </button>
        <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function EditForm({ form, setForm, onSave, onCancel, loading, error }: Omit<FormProps, "title" | "compact">) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input
          autoFocus
          placeholder="Название *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="col-span-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-1"
        />
        <input
          placeholder="slug *"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Иконка (эмодзи)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="number"
          placeholder="Порядок"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={loading || !form.name.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Сохранить
        </button>
        <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700">
          Отмена
        </button>
      </div>
    </div>
  );
}
