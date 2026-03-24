import { getHealthResponse } from "@/adapters/api/rest/healthRoute";

export async function GET() {
  return getHealthResponse();
}
