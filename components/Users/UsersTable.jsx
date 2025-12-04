"use client";
import { deleteUser } from "@/app/[locale]/_Lib/actions";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
function UsersTable({ users }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Table showHeader={false} grid_cols="grid-cols-[0.5fr_2fr]">
      {users.map((user) => (
        <Table.Row grid_cols={"grid-cols-[0.5fr_2fr]"} key={user.id}>
          <Table.Cell className="flex gap-4 items-center">
            {user.avatar && (
              <img
                src={user.avatar.light}
                width={30}
                height={30}
                alt=""
                className="rounded-full"
              />
            )}
            {user.email}
          </Table.Cell>
          <Table.Cell className="flex gap-2 items-center justify-end ">
            <Button
              className={
                "text-white   bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer"
              }
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await deleteUser(user.id);
                  toast.success("The user is Deleted");
                } catch (e) {
                  toast.error("error in Delete");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Delete
            </Button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}

export default UsersTable;
