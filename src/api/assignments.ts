import { http } from "@/api/http";
import type { Assignment } from "@/types/domain";

export async function listAssignments(projectId: number) {
  const { data } = await http.get<Assignment[]>(
    `/projects/${projectId}/assignments`
  );
  return data;
}

export async function changeAssignmentStatus(
  projectId: number,
  assignmentId: number,
  value: "COMPLETED" | "ONGOING" | "PENDING"
) {
  const { data } = await http.patch<Assignment>(
    `/projects/${projectId}/assignments/${assignmentId}/status`,
    null,
    { params: { value } }
  );
  return data;
}
