import { UserService } from '@app/modules/users/user.service';
import { PostService } from '@app/modules/posts/post.service';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { OptionService } from '@app/modules/options/option.service';

export const exportedProviders = [
  OptionService,
  CategoriesService,
  UserService,
  PostService,
];
