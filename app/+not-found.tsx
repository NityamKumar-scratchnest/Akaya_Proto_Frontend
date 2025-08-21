import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return null; // optional loading indicator
}