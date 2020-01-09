import slug from 'limax';

export function getSlug(text, opt?): string {
  return slug(text);
}
