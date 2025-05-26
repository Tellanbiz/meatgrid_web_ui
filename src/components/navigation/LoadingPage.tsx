import ProgressIndicator from "../common/ProgressIndicator";

const LoadingPage = () => {
  return (
    <div className="w-full h-full p-4 flex justify-center items-center">
      <ProgressIndicator />
    </div>
  );
};

export default LoadingPage;
