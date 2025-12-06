import apiClient from "./apiCLient";

// Get all tickets with filters (admin)
export async function getTickets(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.limit) params.set("limit", searchParams.limit);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.priority) params.set("priority", searchParams.priority);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.assignedTo) params.set("assignedTo", searchParams.assignedTo);

    const queryString = params.toString();
    const url = queryString ? `/support/admin/tickets?${queryString}` : "/support/admin/tickets";

    const res = await apiClient.get(url);
    return {
      data: res.data?.data || [],
      pagination: res.data?.pagination || { totalPages: 1, total: 0 }
    };
  } catch (e) {
    console.error("Failed to get tickets:", e);
    throw new Error("Failed to get tickets");
  }
}

// Get ticket by ID
export async function getTicketById(id) {
  try {
    const res = await apiClient.get(`/support/tickets/${id}`);
    return res.data?.data;
  } catch (e) {
    console.error("Failed to get ticket:", e);
    throw new Error("Failed to get ticket");
  }
}

// Get ticket statistics
export async function getTicketStats() {
  try {
    const res = await apiClient.get("/support/admin/stats");
    return res.data?.data;
  } catch (e) {
    console.error("Failed to get ticket stats:", e);
    throw new Error("Failed to get ticket stats");
  }
}
