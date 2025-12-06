import { getRegisteredDevices } from "../../../_Lib/notificationsApi";
import DevicesTable from "@/components/notifications/DevicesTable";

export default async function DevicesPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const deviceType = params?.deviceType || "";
  const isActive = params?.isActive;

  let data = null;
  let error = null;

  try {
    const filters = {};
    if (deviceType) filters.deviceType = deviceType;
    if (isActive !== undefined && isActive !== "") {
      filters.isActive = isActive === "true";
    }

    data = await getRegisteredDevices(page, 20, filters);
  } catch (e) {
    error = e.message;
  }

  return (
    <DevicesTable
      devices={data?.data || []}
      pagination={data?.pagination}
      error={error}
      currentFilters={{ deviceType, isActive }}
    />
  );
}
