import urls from "../../backend/func2url.json";

const API = {
  plants: urls["plants-api"],
  journal: urls["journal-api"],
  reminders: urls["reminders-api"],
  community: urls["community-api"],
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  return res.json();
}

export interface Plant {
  id: number;
  name: string;
  species: string;
  emoji: string;
  water_frequency_days: number;
  light: string;
  humidity: number;
  health: number;
  notes: string;
  last_watered: string | null;
  next_water: string | null;
  variety: string | null;
  purchase_date: string | null;
  price: number | null;
  photo_url: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  entry_date: string;
  tag: string;
  text: string;
  created_at: string;
  plant_id: number;
  plant_name: string;
  plant_emoji: string;
}

export interface Reminder {
  id: number;
  type: string;
  due_date: string;
  is_done: boolean;
  created_at: string;
  plant_id: number;
  plant_name: string;
  plant_emoji: string;
  urgent: boolean;
  time_label: string;
}

export interface CommunityPost {
  id: number;
  author_name: string;
  initials: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  time_ago: string;
  created_at: string;
}

export const plantsApi = {
  getAll: () => request<Plant[]>(API.plants),
  getOne: (id: number) => request<Plant>(`${API.plants}?id=${id}`),
  create: (data: Partial<Plant>) =>
    request<{ id: number; success: boolean }>(API.plants, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: Partial<Plant> & { id: number }) =>
    request<{ success: boolean }>(API.plants, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  water: (plant_id: number) =>
    request<{ success: boolean }>(API.plants, {
      method: "POST",
      body: JSON.stringify({ action: "water", plant_id }),
    }),
};

export const journalApi = {
  getAll: () => request<JournalEntry[]>(API.journal),
  create: (data: { plant_id: number; tag: string; text: string; entry_date?: string }) =>
    request<{ id: number; success: boolean }>(API.journal, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const remindersApi = {
  getAll: () => request<Reminder[]>(API.reminders),
  complete: (reminder_id: number) =>
    request<{ success: boolean }>(API.reminders, {
      method: "POST",
      body: JSON.stringify({ action: "complete", reminder_id }),
    }),
  create: (data: { plant_id: number; type: string; due_date: string }) =>
    request<{ id: number; success: boolean }>(API.reminders, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const communityApi = {
  getAll: () => request<CommunityPost[]>(API.community),
  like: (post_id: number) =>
    request<{ success: boolean }>(API.community, {
      method: "POST",
      body: JSON.stringify({ action: "like", post_id }),
    }),
  create: (data: { author_name: string; text: string; tags: string[] }) =>
    request<{ id: number; success: boolean }>(API.community, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export default API;