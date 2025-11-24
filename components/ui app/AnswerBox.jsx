"use client";

import Image from "next/image";
import imagePerson from "../../public/images/dashboard/avatar.jpg";
import { Input } from "../ui/input";
import { Link, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { replayTicket } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import LoadingScreen from "./loading-screen";
import { Spinner } from "../ui/spinner";
function AnswerBox({ ticket = {}, onClose }) {
  return (
    <div className="bg-dashboard-box dark:bg-[#10131D]  mx-auto  sm:w-[702px] h-[500px] rounded-3xl flex flex-col overflow-hidden ">
      <div className="flex items-center justify-end p-4">
        <X
          size={40}
          className="cursor-pointer text-green-primary hover:text-green-primary/70 dark:text-white dark:hover:text-white/70 transition-colors duration-300 "
          onClick={() => {
            onClose();
          }}
        />
      </div>
      <div className="px-4 md:px-11 pt-0 overflow-y-auto space-y-8 flex-1">
        <PersonMessage
          info={{
            imagePerson: "",
            name: "",
            date: "2023-06-01",
            message: ticket?.description,
          }}
        />
        {ticket?.replyMessage && (
          <PersonMessage
            typePerson={"answer"}
            info={{
              imagePerson: "",
              name: "",
              date: "2023-06-01",
              message: ticket?.replyMessage,
            }}
          />
        )}
      </div>
      <SendMessageInput id={ticket.id} />
    </div>
  );
}

function PersonMessage({ info, typePerson = "question" }) {
  return (
    <div
      className={`flex items-center gap-4  ${
        typePerson === "answer" && "flex-row-reverse"
      } `}
    >
      {info.imagePerson && (
        <Image
          className="rounded-lg"
          src={info.imagePerson}
          alt="person"
          width={60}
          height={60}
        />
      )}
      <div>
        <h3 className="font-semibold">{info.name}</h3>
        <p>{info.message}</p>
        <span className="text-[#667085]">{info.date}</span>
      </div>
    </div>
  );
}
function SendMessageInput({ id }) {
  const formik = useFormik({
    initialValues: {
      replyMessage: "",
    },
    onSubmit: async (values) => {
      //
      try {
        await replayTicket(id, { ...values, id: id });
        formik.resetForm();
        toast.success("Message sent successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
    validationSchema: Yup.object({
      replyMessage: Yup.string().required("Required"),
    }),
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-dashboard-box  dark:bg-[#0F1017] p-4"
    >
      <div className="flex items-center justify-between bg-dashboard-box  dark:bg-[#10131D] py-4 px-2.5 gap-4 rounded-xl">
        <Input
          name="replyMessage"
          value={formik.values.replyMessage}
          onChange={formik.handleChange}
          className={
            " text-[#10131D] dark:text-white  dark:bg-[#10131D]  shadow-none border-none focus:outline-none "
          }
          type="text"
          placeholder="Type your message..."
        />
        <div className="flex items-center gap-3">
          {/* <Link className="cursor-pointer h-4 w-4" />
          <span className="h-[20px] w-[1px] bg-gray-400"></span> */}
          <Button
            disabled={formik.isSubmitting || !formik.isValid}
            type="submit"
            className="bg-green-primary cursor-pointer size-9 rounded-full flex justify-center items-center hover:bg-green-primary/70 "
          >
            {formik.isSubmitting ? (
              <Spinner className="w-10 h-10" />
            ) : (
              <Send className="text-white" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default AnswerBox;
