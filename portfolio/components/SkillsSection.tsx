"use client";

import {useState} from "react";
import {Box, ChevronDown, Code2, PenTool, Search, type LucideIcon} from "lucide-react";
import type {SkillCategory, SkillIconName} from "@/types/skill";

type SkillsSectionProps = {
  categories: SkillCategory[];
};

const skillIcons: Record<SkillIconName, LucideIcon> = {
  "pen-tool": PenTool,
  search: Search,
  "code-2": Code2,
  box: Box,
};

const accents = ["#d00084", "#9b5de5", "#009bdb", "#00aeef"];

function SkillContent({category}: {category: SkillCategory}) {
  return (
    <>
      <ul className="mt-5 space-y-1 pl-4 text-sm text-slate-300">
        {category.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      {category.tools?.length ? (
        <div className="mt-6 border-t border-slate-700 pt-3 text-sm">
          <p className="text-xs text-slate-500">Herramientas</p>
          <p className="mt-1 text-slate-300">{category.tools.join(" · ")}</p>
        </div>
      ) : null}
    </>
  );
}

export function SkillsSection({categories}: SkillsSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!categories.length) return null;

  return (
    <section
      aria-labelledby="skills-title"
      className="home-skills mt-10"
    >
      <h2 id="skills-title" className="home-section-label">Skills</h2>

      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = skillIcons[category.icon as SkillIconName] ?? Box;
          const accent = accents[index % accents.length];

          return (
            <article
              key={category._id}
              className="home-skill-card min-w-0 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <Icon aria-hidden className="h-8 w-8 shrink-0" style={{color: accent}} />
                <h3
                  className="m-0 text-base font-bold"
                  style={{color: accent, margin: 0}}
                >
                  {category.title}
                </h3>
              </div>
              <SkillContent category={category} />
            </article>
          );
        })}
      </div>

      <div className="home-skills-mobile divide-y divide-slate-800 overflow-hidden rounded-xl md:hidden">
        {categories.map((category, index) => {
          const panelId = `skill-panel-${category.slug}`;
          const isOpen = expanded === category._id;
          const Icon = skillIcons[category.icon as SkillIconName] ?? Box;
          const accent = accents[index % accents.length];

          return (
            <article key={category._id}>
              <button
                type="button"
                className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setExpanded(isOpen ? null : category._id)}
              >
                <Icon aria-hidden className="h-6 w-6 shrink-0" style={{color: accent}} />
                <span className="flex-1 font-semibold" style={{color: accent}}>
                  {category.title}
                </span>
                <ChevronDown
                  aria-hidden
                  className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <div id={panelId} className="px-4 pb-5 pl-14">
                  <SkillContent category={category} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
