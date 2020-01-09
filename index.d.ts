type Options = {
  custom?: string[] | { [key: string]: string; };
  lang?: string;
  maintainCase?: boolean;
  replacement?: string;
  separator?: string;
  separateNumbers?: boolean;
  tone?: boolean;
} | string;

declare function slug(text: string, opt?: Options): string;

export default slug;
