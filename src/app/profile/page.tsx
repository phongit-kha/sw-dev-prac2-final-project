import ProfileCard from "@/component/ProfileCard";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getProfile } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=/profile");
  }
  const profile = await getProfile(session.user.token);

  return (
    <div className="px-6">
      <ProfileCard user={profile.data} />
    </div>
  );
}
