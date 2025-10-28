"use client";
import UserItem from "./UserItem";
import Admin from "../icons/Admin";
import SupportUserIcon from "../icons/SupportUserIcon";
import CreatorUserIcon from "../icons/CreatorUserIcon";
import { useState } from "react";

const users = [
  {
    icon: <Admin />,
    label: "Admin",
  },
  {
    icon: <SupportUserIcon />,
    label: "Support",
  },
  { label: "Creator", icon: <CreatorUserIcon /> },
];
function UsersContainer({ formik }) {
  const [selectedUser, setSelectedUser] = useState("admin");
  return (
    <ul className="flex flex-col gap-4 min-w-[200px]">
      {users.map((user) => (
        <UserItem
          selectedUser={selectedUser}
          onClick={() => {
            setSelectedUser(user.label.toLowerCase());
            formik.setFieldValue("role", user.label.toLowerCase());
          }}
          key={user.label}
          icon={user.icon}
          label={user.label}
        />
      ))}
    </ul>
  );
}

export default UsersContainer;
