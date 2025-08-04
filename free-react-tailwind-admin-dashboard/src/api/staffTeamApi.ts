import { Team } from "../types/team";

const BASE_URL = "https://provided-counseling-preferred-replacement.trycloudflare.com/"; // hoặc env

export async function getTeams(token: string): Promise<Team[]> {
    console.log("token:", token);
  const res = await fetch(`${BASE_URL}team/get-team`, {
    method: "GET",
    headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không thể lấy danh sách nhóm");
  const json = await res.json();
  return json.data.teams; 
}

export async function createTeam(data: Team, token: string) {
  const res = await fetch(`${BASE_URL}team/create-team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể tạo nhóm");
}

export async function updateTeam(data: Team, token: string) {
  const res = await fetch(`${BASE_URL}team/update-team`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật nhóm");
}

export async function deleteTeam(id: string, token: string) {
  const res = await fetch(`${BASE_URL}team/delete-team/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Không thể xoá nhóm");
}
