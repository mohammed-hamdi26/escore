import Image from "next/image";
import TeamLogo from "@/public/images/teams management/Bilibili.png";
import Table from "@/components/ui app/Table";

const columns = [
  { id: "player", header: "Player" },
  { id: "Team", header: "Team " },
  { id: "age", header: "age" },
  { id: "Country", header: "Country" },
];
function page() {
  return (
    <div>
      <div className="flex  items-center gap-6 mb-16 ">
        <div className="bg-[#232838] size-28 flex justify-center items-center rounded-full">
          <Image src={TeamLogo} height={64} width={64} alt="TeamLogo" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">BILIBILI</h3>
          <p className="text-[#BABDC4]">Saudi Arabia</p>
        </div>
      </div>
      <Table
        columns={columns}
        grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
      />
    </div>
  );
}

export default page;
