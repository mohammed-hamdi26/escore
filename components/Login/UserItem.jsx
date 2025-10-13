function UserItem({ icon, label }) {
  return (
    <li className="flex items-center gap-4 bg-[#2895461A] py-3 px-4 rounded-full ">
      <div className="flex justify-center items-center rounded-full size-13 bg-[#167731]">
        {icon}
      </div>
      <p className=" text-lg font-semibold ">{label}</p>
    </li>
  );
}

export default UserItem;
