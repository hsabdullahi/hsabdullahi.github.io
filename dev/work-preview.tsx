import { WorkIndex } from "@/components/pages/work-index";
import { exampleProject } from "./fixtures";
export default function WorkPreview() {
  return <WorkIndex entries={[exampleProject]} preview />;
}
