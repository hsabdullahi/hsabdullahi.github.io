import fs from "node:fs";
import path from "node:path";
const directory = "app/(archives)";
fs.rmSync(directory, { recursive: true, force: true });
function write(file, source) {
  const location = path.join(directory, file);
  fs.mkdirSync(path.dirname(location), { recursive: true });
  fs.writeFileSync(location, source);
}
for (const kind of ["talks", "projects"]) {
  const records = JSON.parse(
    fs.readFileSync(`content/${kind}.json`, "utf8"),
  ).filter((record) => record.status === "published");
  if (!records.length) continue;
  const speaking = kind === "talks",
    route = speaking ? "speaking" : "work",
    name = speaking ? "SpeakingIndex" : "WorkIndex",
    detail = speaking ? "TalkDetail" : "ProjectDetail",
    prop = speaking ? "talk" : "project";
  const title = speaking ? "Speaking" : "Selected work",
    description = speaking
      ? "Talks, workshops, seminars and approved presentation resources."
      : "Selected engineering, education and institutional systems projects.";
  write(
    `${route}/page.tsx`,
    `import { ${name} } from '@/components/pages/${speaking ? "speaking" : "work"}-index';\nimport { pageMetadata } from '@/lib/metadata';\nexport const metadata=pageMetadata(${JSON.stringify(title)},${JSON.stringify(description)},'/${route}/');\nexport default function Page(){return <${name}/>;}\n`,
  );
  write(
    `${route}/[slug]/page.tsx`,
    `import { notFound } from 'next/navigation';\nimport { ${kind} } from '@/lib/content';\nimport { ${detail} } from '@/components/pages/${speaking ? "talk" : "project"}-detail';\nimport { pageMetadata, archivePageTitle } from '@/lib/metadata';\nexport const dynamicParams=false;\nexport function generateStaticParams(){return ${kind}.map(record=>({slug:record.slug}));}\nexport async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const record=${kind}.find(record=>record.slug===slug);return record?pageMetadata(archivePageTitle(record,${kind}),record.${speaking ? "summary" : "context"},'/${route}/'+slug+'/'):{};}\nexport default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const record=${kind}.find(record=>record.slug===slug);if(!record)notFound();return <${detail} ${prop}={record}/>;}\n`,
  );
}
console.log(
  "Conditional work and speaking routes synchronised with published content.",
);
