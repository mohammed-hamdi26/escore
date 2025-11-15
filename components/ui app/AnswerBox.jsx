import Image from "next/image";
import imagePerson from "../../public/images/dashboard/avatar.jpg";
import { Input } from "../ui/input";
import { Link, Send, X } from "lucide-react";
import { Button } from "../ui/button";
function AnswerBox({ chat, onClose }) {
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
        {Array.from({ length: 2 }, (_, index) => (
          <PersonMessage
            info={{
              imagePerson,
              name: "ahmed",
              date: "2023-06-01",
              message: " Hello, how can I help you?",
            }}
            key={index}
          />
        ))}
      </div>
      <SendMessageInput />
    </div>
  );
}

function PersonMessage({ info }) {
  return (
    <div className="flex gap-4  ">
      <Image
        className="rounded-lg"
        src={info.imagePerson}
        alt="person"
        width={60}
        height={60}
      />
      <div>
        <h3 className="font-semibold">{info.name}</h3>
        <p>{info.message}</p>
      </div>
    </div>
  );
}
function SendMessageInput() {
  return (
    <div className="bg-dashboard-box  dark:bg-[#0F1017] p-4">
      <div className="flex items-center justify-between bg-dashboard-box  dark:bg-[#10131D] py-4 px-2.5 gap-4 rounded-xl">
        <Input
          className={
            " text-[#10131D]  dark:bg-[#10131D]  shadow-none border-none focus:outline-none "
          }
          type="text"
          placeholder="Type your message..."
        />
        <div className="flex items-center gap-3">
          {/* <Link className="cursor-pointer h-4 w-4" />
          <span className="h-[20px] w-[1px] bg-gray-400"></span> */}
          <Button className="bg-green-primary cursor-pointer size-9 rounded-full flex justify-center items-center hover:bg-green-primary/70 ">
            <Send className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AnswerBox;
