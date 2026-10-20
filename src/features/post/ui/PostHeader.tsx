import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import { Verification } from "@shared/icons";
import { formatPostDate } from "@/shared/utils/formatPostDate";
import { Avatar } from "@/shared/ui/Avatar";
import { useUser } from "@/entities/user/useUser";

type Props = {
  author: string;
  userTag: string;
  dateOfCreation: string;
};

dayjs.extend(relativeTime);

export const PostHeader = ({ author, userTag, dateOfCreation }: Props) => {
  const postDate = formatPostDate(dateOfCreation);
  const { user } = useUser();

  return (
    <div className="flex">
      <Avatar user={user} />
      <div className="grid ml-3">
        <div className="flex gap-2 items-center">
          <span className="font-semibold font-base">{author}</span>
          <Verification className="size-5 text-orange-500" />
        </div>
        <span className="text-xs text-gray-500">
          @{userTag} · {postDate}
        </span>
      </div>
    </div>
  );
};
