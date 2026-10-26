import { TalkDetail } from "@/components/pages/talk-detail";
import { exampleTalk } from "./fixtures";
export default function SpeakingPreview() {
  return <TalkDetail talk={exampleTalk} preview />;
}
