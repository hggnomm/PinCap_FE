import { Tag } from "@/types/type";

export const getTagName = (tag: Tag): string => {
  return tag.tag_name || "";
};

export const mapTagsToStrings = (tags: Tag[] | undefined): string[] => {
  if (!tags) return [];
  return tags.map(getTagName).filter((name) => name.trim() !== "");
};

export const mapStringsToTags = (tagNames: string[]): Partial<Tag>[] => {
  return tagNames
    .map((name) => ({ tag_name: name.trim() }))
    .filter((tag) => tag.tag_name);
};
