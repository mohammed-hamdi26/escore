import { getAvatars } from "@/app/[locale]/_Lib/avatarApi";
import AvatarsContainer from "@/components/settings-avatars/avatars-container";

async function page() {
  const avatars = await getAvatars();
  return <AvatarsContainer avatars={avatars} />;
}

export default page;
