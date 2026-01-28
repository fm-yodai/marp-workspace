import matter from 'gray-matter';

export interface MarpFrontMatter {
  marp: boolean;
  theme: string;
  paginate?: boolean;
  size?: string;
  [key: string]: unknown;
}

export function parseFrontMatter(content: string): MarpFrontMatter {
  const { data } = matter(content);
  return data as MarpFrontMatter;
}

export function stringifyFrontMatter(data: MarpFrontMatter, content: string = ''): string {
  return matter.stringify(content, data);
}
