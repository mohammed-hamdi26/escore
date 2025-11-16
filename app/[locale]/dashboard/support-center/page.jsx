import SupportCenterTable from "@/components/Support Center/SupportCenterTable";
import { getTickets } from "../../_Lib/supportCenterApi";

async function page() {
  // const tickets = await getTickets();
  const tickets = [
    {
      id: 1,
      createdAt: "2023-01-01",
      user: { name: "John Doe" },
      description: "I need help with my account",
    },
  ];

  return <SupportCenterTable tickets={tickets} />;
}

export default page;
