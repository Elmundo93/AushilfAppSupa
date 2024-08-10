import { Post } from '@/src/types/post';

export const applyFilters = (
  posts: Post[],
  suchenChecked: boolean,
  bietenChecked: boolean,
  gartenChecked: boolean,
  haushaltChecked: boolean,
  sozialesChecked: boolean,
  gastroChecked: boolean
): Post[] => {
  let filtered = posts;

  if (suchenChecked || bietenChecked) {
    filtered = filtered.filter(post =>
      suchenChecked ? post.option === 'suchen' : post.option === 'bieten'
    );
  }

  const categories = [
    gartenChecked ? 'garten' : '',
    haushaltChecked ? 'haushalt' : '',
    sozialesChecked ? 'soziales' : '',
    gastroChecked ? 'gastro' : '',
  ].filter(Boolean);

  if (categories.length > 0) {
    filtered = filtered.filter(post => categories.includes(post.category));
  }

  return filtered;
};