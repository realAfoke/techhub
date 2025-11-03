import aixos from "axios";
import "./styles/app.css";
import { useLoaderData } from "react-router-dom";
import axios from "axios";

export function loader() {
  axios
    .get("http://127.0.0.1:8000")
    .then((response) => console.log(response.data))
    .catch((err) => console.error(err));
}
export default function App() {
  const app = useLoaderData();
  // console.log(app)
  return (
    <>
      <h1 className="">hello world</h1>
    </>
  );
}
