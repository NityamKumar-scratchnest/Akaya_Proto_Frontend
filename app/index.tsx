import { Redirect } from "expo-router";

export default function Index() {
  // Redirect the user straight to /login
  return <Redirect href="/login" />;
}
