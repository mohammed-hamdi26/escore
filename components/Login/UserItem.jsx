function UserItem({ icon, label, selectedUser, onClick, t }) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-4 bg-green-primary cursor-pointer dark:bg-[#2895461A] py-3 px-4 rounded-full w-fit "
    >
      <div className="flex justify-center items-center rounded-full size-13 bg-[#167731]">
        {icon}
      </div>
      {selectedUser === label.toLowerCase() && (
        <p className=" text-lg font-semibold ">{t(label)}</p>
      )}
    </li>
  );
}

export default UserItem;
