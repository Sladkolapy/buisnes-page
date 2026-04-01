export async function updateUserRole(role: string): Promise<void> {
  const res = await fetch("/api/user/role", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to update role");
  }
}
