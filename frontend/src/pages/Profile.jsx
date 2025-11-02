import { api } from "../utils";
export default function Profile() {
  return <div>Profile underconstruction</div>;
}

export async function profileLoader() {
  try {
    const profileInfo = await api.get("me/");
  } catch (error) {
    console.error(error);
  }
}
