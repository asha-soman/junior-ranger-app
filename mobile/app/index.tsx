import { Redirect } from "expo-router";
import { getAuth } from "./auth";

export default function Index() {
  const loggedIn = getAuth();

  if (loggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/landing" />;
}