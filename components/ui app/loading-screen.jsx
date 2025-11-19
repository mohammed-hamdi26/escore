import { Spinner } from "../ui/spinner";

function LoadingScreen() {
  return (
    <div className="h-dvh flex justify-center items-center ">
      <Spinner className="w-10 h-10" />
    </div>
  );
}

export default LoadingScreen;
