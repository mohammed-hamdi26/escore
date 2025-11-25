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
    value: "ROLE_ADMIN",
  },
  {
    icon: <SupportUserIcon />,
    label: "Support",
    value: "ROLE_USER",
  },
  { label: "Creator", icon: <CreatorUserIcon /> },
];
function UsersContainer({ t, formik }) {
  const [selectedUser, setSelectedUser] = useState("admin");
  return (
    <ul className="flex flex-row md:flex-col gap-4 md:min-w-[200px]">
      {users.map((user) => (
        <UserItem
          t={t}
          selectedUser={selectedUser}
          onClick={() => {
            setSelectedUser(user.label.toLowerCase());
            formik.setFieldValue("authorities", [user.value]);
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
