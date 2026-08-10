export type SkillIconName = "pen-tool" | "search" | "code-2" | "box";

export type SkillCategory = {
  _id: string;
  title: string;
  slug: string;
  order: number;
  icon: SkillIconName | string;
  skills: string[];
  tools?: string[];
  experienceLevel?: "applied" | "project";
};
