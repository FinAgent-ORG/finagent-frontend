import SigninPage from "@/src/components/SigninPage.jsx";

export default async function SigninRoute({ searchParams }) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams;
  const nextPath = typeof params?.next === "string" && params.next.startsWith("/") ? params.next : "/dashboard";

  return <SigninPage nextPath={nextPath} />;
}
