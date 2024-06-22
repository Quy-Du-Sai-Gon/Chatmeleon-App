import { User } from "@prisma/client";
import Image from "next/image";
import StatusBubble from "../status/StatusBubble";
interface AvatarProps {
  imageURL?: string | null;
}

const Avatar: React.FC<AvatarProps> = ({ imageURL }) => {
  return (
    <div className="relative">
      <div
        className="
            relative
            inline-block
            rounded-full
            overflow-hidden
            h-9
            w-9
            md:h-11
            md:w-11
        "
      >
        <Image
          alt="User Avatar"
          src={imageURL || "/images/avatar/LavenderLizard_BG.png"}
          fill
        />
      </div>
      <StatusBubble color="green"></StatusBubble>
    </div>
  );
};

export default Avatar;
