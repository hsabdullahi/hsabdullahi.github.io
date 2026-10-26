import { ProjectDetail } from "@/components/pages/project-detail";
import { exampleProject } from "./fixtures";
export default function ProjectPreview() {
  return <ProjectDetail project={exampleProject} preview />;
}
