"use client";
import { deleteUser } from "@/app/[locale]/_Lib/actions";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../ui app/Pagination";
function UsersTable({ users, meta }) {
  const [isLoading, setIsLoading] = useState(false);
  console.log(users);

  return (
    <div className="space-y-8">
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
            {/* <Table.Cell>{user.password}</Table.Cell> */}
            <Table.Cell className="flex gap-2 items-center justify-end ">
              <Link href={`/dashboard/users/${user.id}/edit`}>
                <Button
                  disabled={isLoading}
                  className={
                    "text-white   bg-green-primary hover:bg-green-primary/80 rounded-full min-w-[100px] cursor-pointer"
                  }
                >
                  Edit
                </Button>
              </Link>

              <Button
                disabled={isLoading}
                className={
                  "text-white   bg-[#3A469D] hover:bg-[#3A469D]/80 rounded-full min-w-[100px] cursor-pointer"
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
      <Pagination numPages={meta.totalPages} />
    </div>
  );
}

export default UsersTable;
