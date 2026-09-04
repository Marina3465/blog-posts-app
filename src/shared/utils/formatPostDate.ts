import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isYesterday);

export function formatPostDate(dateOfCreation: Date): string {
  const postDate = dayjs(dateOfCreation);
  const now = dayjs();

  const diffInSeconds = now.diff(postDate, "second");

  if (diffInSeconds < 45) {
    return "Just now";
  }

  if (now.diff(postDate, "hour") < 24) {
    return postDate.fromNow();
  }

  if (postDate.isYesterday()) {
    return "Yesterday";
  }

  return postDate.format("D MMM YYYY");
}
