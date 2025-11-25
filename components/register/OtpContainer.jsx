import OtpInput from "../ui app/OtpInput";

function OtpContainer() {
  return (
    <div className="flex  w-full  justify-center z-10 ">
      <div className="bg-white lg:w-1/4  sm:w-1/2 w-[95%]  mx-auto px-4 py-10 rounded-lg shadow-lg space-y-6 flex justify-center flex-col items-center">
        <div className={"w-full text-center"}>
          <h1 className="text-3xl text-background font-bold">Verify code</h1>
          <p className="text-gray-500 font-semibold mt-2">
            An authentication code has been sent to your email.
          </p>
        </div>
        <OtpInput />
      </div>
    </div>
  );
}

export default OtpContainer;
