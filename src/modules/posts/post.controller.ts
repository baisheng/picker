import { All, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { Permission } from '@app/common/generated-types';
import { ID } from '@app/common/shared-types';
import { EUserPostsBehavior } from '@app/common/types/common-types';
import { formatAllMeta, formatOneMeta } from '@app/common/utils';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { IQueryParamsResult, QueryParams } from '@app/decorators/query-params.decorator';
import { PostEntity } from './post.entity';
// import { AttachmentService, CategoriesService, CommentService, OptionService, PostService, UserService } from '../../../service';
import { UserService } from '@app/modules/users/user.service';
import { OptionService } from '@app/modules/options/option.service';
import { Allow } from '@app/decorators/allow.decorator';
import { PostService } from '@app/modules/posts/post.service';
import { CategoriesService } from '@app/modules/categories/categories.service';
import { AttachmentService } from '@app/processors/helper/helper.service.attachment';
import { getSlug } from '@app/common/helpers/utils/slug';
import * as _ from 'lodash';
import { TermService } from '@app/modules/terms/term.service';
import { ancestorWhere } from 'tslint';
import { PostDto } from '@app/modules/posts/post.dto';
import { Crud } from '@nestjsx/crud';

// import { JwtAuthGuard } from '../../middleware/guards/auth.guard';
// @Crud({
//   model: {
//     type: PostEntity,
//   },
// })
@Controller('post')
export class PostController {
  constructor(
    private readonly userService: UserService,
    private  postService: PostService,
    private readonly optionService: OptionService,
    private readonly categoriesService: CategoriesService,
    private readonly termService: TermService,
    private readonly attachmentService: AttachmentService,
  ) {
  }

  /**
   * 按分页条件查询全部内容
   * @param page
   * @param limit
   */
  @Get('index')
  @Allow(Permission.Authenticated)
  async index(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.postService.paginate({
      page,
      limit,
      route: 'posts',
    });
    // 处理 meta 数据
    await this.dealDataList(data.items);
    return data;
  }

  @Post()
  @Allow(Permission.Authenticated)
  @HttpProcessor.handle('添加内容')
  async createPost(@Body() data: PostDto, @Req() req): Promise<PostEntity> {
    // 1 处理基础信息
    // return this.postService.
    // tc.filter 应该做敏感词过滤
    // post.title = tc.filter(post.title)
    // 处理 slugName
    data.author = req.user.id;
    data.name = getSlug(data.title);
    // 如果不允许同名内容出现，则这里做查询同名内容并返回内容本身
    // let hasData = await postModel.findByName(slugName)
    // if (!think.isEmpty(hasData)) {
    //   await this.decoratorData(hasData)
    //   return this.success(hasData)
    // }
    if (_.isEmpty(data.status)) {
      data.status = 'auto-draft';
    }
    if (!_.isEmpty(data.block)) {
      data.block = JSON.stringify(data.block);
    }
    // 2 更新 meta 信息(如封面、样式等)
    if (!_.isEmpty(data.metas)) {
      // save meta 信息
    }

    // 3 保存内容基本信息
    // const defaultTerm = 从 options 中 或 configService 中获取
    const newPostEntity = await this.postService.create(
      new PostEntity({
        author: data.author,
        name: data.name,
        status: data.status,
        block: data.block,
        content: data.content,
        // allowComment: false,
        // commentNum: 0,
        excerpt: data.excerpt,
        // guid: '',
        mimeType: data.mimeType,
        parent: data.parent,
        password: data.password,
        sort: data.sort,
        title: data.title,
        type: data.type,
        metas: data.metas,
      }));

    // 4 关联类别
    if (!Object.is(data.categories, undefined) && !_.isEmpty(data.categories)) {
      // 查询内容分类
      const currentCategories = await this.categoriesService.findCategoriesByObject(newPostEntity.id);
      const xors = _.xor(_.map(currentCategories, 'termId'), data.categories);
      // 没有就添加，有就删除
      for (const cate of xors) {
        await this.termService.relationships(newPostEntity.id, data.categories);
      }
    } else {
      // 如果未分类，添加到默认分类中
      await this.termService.relationshipsSingle(newPostEntity.id, 1);
    }
    // 5 如果内容需要格式化，则关联对应的格式类别
    if (!Object.is(data.format, undefined) && !_.isEmpty(data.format)) {
      await this.termService.relationshipsSingle(newPostEntity.id, data.format);
    }
    // 6 获取完整的内容
    // let mergePost = await this.postService.findById(newPostEntity.id);
    // newPostEntity
    // 7 装饰内容
    return newPostEntity;
  }

  private decoratorData(post: PostEntity) {
    // 装饰作者
    // 根据内容类型装饰
  }

  private async _decoratorTerms(post: PostDto) {
    // post.categories = await this.categoriesService.findCategoriesByObject(post.id);
  }

  // patchPosts()
  // delArticles()

  @Get('categories/:category')
  // @HttpProcessor.handle('获取类别下的内容')
  @Allow(Permission.Authenticated)
  async findByCategory(
    @Req() req: any,
    @Param('category') category: any,
    @Query('page') page: number = 0, @Query('limit') limit: number = 10,
  ): Promise<any> {
    const query = req.query;
    // console.log(query.skip)
    let list: any;
    switch (category) {
      case 'new' : {
        list = await this.postService.getNews(10);
        break;
      }
      case 'popular': {
        list = await this.postService.getPopular();
        break;
      }
      case 'featured': {
        const options = await this.optionService.load(true);
        const stickys: {
          [key: string]: [number];
        } = options.stickys;
        list = await this.postService.getStickys(stickys.default);
        break;
      }
      default: {
        list = await this.postService.getFromCategory(category, undefined, query);
      }
    }
    // await this.dealData(list.items);
    list = await this.dealDataList(list);

    return list;
  }

  /**
   * 获取浏览此内容的用户列表
   * TODO: 待做分页处理
   * @param postId
   * @param req
   */
  @Get(':id/views')
  @HttpProcessor.handle('获取单个内容数据')
  @Allow(Permission.Owner)
  async getViews(@Param('id') postId: ID, @Req() req: any) {
    const result = await this.postService.getUsersByBehavior(EUserPostsBehavior.VIEW, postId);
    let iView = false;
    let found = 0;
    const views = [];
    if (!_.isEmpty(result)) {
      if (!_.isEmpty(result.value)) {
        const list = JSON.parse(result.value);
        const exists = _.find(list, ['id', req.user.id]);
        if (exists) {
          iView = true;
        }
        found = list.length;
        const users = await this.userService.getUsersDetailByIds(_.filter(list, 'id'));
        views.push(...users);
      }
    }
    if (views.length > 0) {
      formatAllMeta(views);
      for (const user of views) {
        Reflect.deleteProperty(user, 'meta');
      }
    }
    return {
      found,
      iView,
      postId,
      views,
    };
  }

  /**
   * 增加或更新新浏览者
   * @param postId
   * @param req
   * @param ip
   */
  @Post(':id/views/new')
  @Allow(Permission.Owner)
  async newViewer(@Param('id') postId: ID, @Req() req: any, @QueryParams() params: IQueryParamsResult) {
    const ip = params.visitors.ip;
    const result = await this.postService.getUsersByBehavior(EUserPostsBehavior.VIEW, postId);
    let iView = false;
    let viewCount = 0;
    let updateResult: any;
    if (!_.isEmpty(result)) {
      if (!_.isEmpty(result.value)) {
        const list = JSON.parse(result.value);
        viewCount = list.length;
        iView = _.find(list, item => {
          // 由于 mysql json search 函数仅支持字符查询，如果 id 为数字存储查询时会需要做特殊处理
          return item.id.toString() === req.user.id.toString();
        });
        if (!iView) {
          // 如果当前用户未普浏览过，即增加。
          // 新增加浏览者
          updateResult = await this.postService.newViewer(req.user.id, postId, ip);
          if (updateResult) {
            viewCount++;
          }
        } else {
          // 更新浏览者信息
          await this.postService.updateViewer(req.user.id, postId, ip);
        }
      }
    } else {
      // 增加新浏览者
      updateResult = await this.postService.newViewer(req.user.id, postId, ip);
      if (updateResult) {
        viewCount++;
      }
    }
    return {
      iView: true,
      viewCount,
      postId,
    };
  }

  @Get(':id')
  // @HttpProcessor.handle('获取单个内容数据')
  // @OnUndefined(404)
  @Allow(Permission.Authenticated)
  async one(@Param('id') id: ID) {
    // this.postService.
    // return await this.postService.findById(id);
    const post = await this.postService.findById(id);
    let data: any;
    // 装饰类别
    data = await this.decoratorTerms(post);
    // 装饰作者
    switch (post.type) {
      case 'page': {
        // 处理页面类型数据
        data = await this.decoratorIsPage(data);
        break;
      }
      case 'post_format': {
        // 处理内容格式化数据
        data = await this.formatData(data);
        break;
      }
      default:
        break;
    }
    data = await this.dealBlock(data);
    data = await this.decoratorSingleData(data);
    Reflect.deleteProperty(data, 'meta');
    return data;
  }

  private async decoratorSingleData(data: object) {
    data = formatOneMeta(data);
    return await this._formatOneData(data);
  }

  private async dealDataList(list: any[]) {
    formatAllMeta(list);
    // this.formatMeta(data);
    // const items = [];
    for (const item of list) {
      await this._formatOneData(item);
    }
    return list;
  }

  private async _formatOneData(item: any) {
    if (_.has(item.meta, '_items')) {
      // 用于处理标注 block 数据状态
      // item.items = JSON.parse(item.meta._items);
      item.blockStatus = item.meta._items;
    }
    let result = { ...item };
    result.url = '';
    // 如果有音频
    if (!Object.is(result.meta._audio_id, undefined)) {
      // 音频播放地址
      result.url = await this.attachmentService.getAttachment(result.meta._audio_id);
    }
    // if (_.has(result.meta, 'items')) {
    //   result.items = JSON.parse(result.meta.items);
    // }
    // 作者信息
    result.authorInfo = await this.userService.getDetailById(result.author);
    formatOneMeta(result.authorInfo);
    if (_.has(result.authorInfo, 'meta')) {
      if (_.has(result.authorInfo.meta, 'avatar')) {
        result.authorInfo.avatarUrl = await this.attachmentService.getAttachment(result.authorInfo.meta.avatar);
      }
      if (!Object.is(result.authorInfo.meta[`_wechat`], undefined)) {
        result.authorInfo.avatarUrl = result.authorInfo.meta[`_wechat`].avatarUrl;
      }
      // 作者简历
      if (_.has(result.authorInfo.meta, 'resume')) {
        // if (!Object.is(item.author.meta.resume, undefined)) {
        result.authorInfo.resume = result.authorInfo.meta.resume;
      }
      Reflect.deleteProperty(result.authorInfo, 'meta');
    }
    // Liked
    if (_.has(result.authorInfo, 'liked')) {
      Reflect.deleteProperty(result.authorInfo, 'liked');
    }
    result.likeCount = await this.postService.countByBehavior(EUserPostsBehavior.LIKE, result.id);
    // item.thumbCount = await this.postService.countBy(EInteractionBy.THUMB, item.id);
    result.viewCount = await this.postService.countByBehavior(EUserPostsBehavior.VIEW, result.id);
    // 留言数量
    // 如果有封面 默认是 thumbnail 缩略图，如果是 podcast 就是封面特色图片 featured_image
    if (_.has(result.meta, '_thumbnail_id')) {
      // item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
      const featured_image = await this.attachmentService.getAttachment(result.meta._thumbnail_id);
      result = Object.assign(result, { featured_image });
      // if (_.isEmpty(featured_image)) {
      // 随机封面
      // } else {
      // }
    }
    // console.log(result);
    item = Object.assign(item, result);
    Reflect.deleteProperty(item, 'meta');
    return item;
  }

  /**
   * 为查询结果添加分类信息
   * @param post Post
   */
  private async decoratorTerms(post: PostEntity) {
    const data: any = {};
    data.categories = _.map(await this.categoriesService.findCategoriesByObject(post.id), 'taxonomyId');
    // 查询 post-format 是何种类型的格式分类, 比如是 audio、doc 等
    const postTermFormat = await this.categoriesService.formatTermForObject(post.id);
    if (postTermFormat && !_.isEmpty(postTermFormat)) {
      post.type = postTermFormat.slug;
    }
    return Object.assign({}, post, PostEntity);
  }

  private async decoratorTags(data: any) {
    // post.tags
    data.tags = await this.categoriesService.getTagsByObject(data.id);
  }

  /**
   * 处理区块列表数据
   * @param obj
   */
  private async dealBlock(post: any) {
    if (!_.isEmpty(post.block)) {
      const blockList = await this.postService.loadBLock(post.block);
      post.block = blockList;
    }
    return post;
  }

  /**
   * 格式化数据
   */
  private async formatData(post: PostEntity): Promise<any> {
    return await this.postService.getFormatData(post);
  }

  /**
   * 装饰类型为 page 的数据
   * @param post
   */
  private async decoratorIsPage(post: PostEntity) {
    const options = await this.optionService.load();
    const stickys: {
      [key: string]: [number];
    } = options.stickys;
    // 精选内容标记
    const isSticky = _.find(stickys.default, id => {
      return post.id === id;
    });
    let data: any;
    if (isSticky) {
      data = Object.assign({}, post, {
        isSticky: true,
      });
    } else {
      data = Object.assign({}, post, {
        isSticky: false,
      });
    }
    return data;
  }

  // 处理标签信息
  // private async decoratorTags() {}
  // private async dealBlock() {
  // }

  // @Get('views')
  // async views() {
  // }
}
