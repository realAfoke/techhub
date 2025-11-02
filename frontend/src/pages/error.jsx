import { useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-[20px]">Oops!</h1>
      <p>Sorry an unexpected error has occured</p>
      <p className="text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
