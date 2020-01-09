/**
 * Helper Seo service.
 * @file Helper Seo 模块服务
 * @module module/helper/seo.service
 */

import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';
import { getMessageFromAxiosError } from '@app/transforms/error.transform';

// 提交器支持的操作行为
export type TUrl = string;
export type TActionUrl = TUrl | TUrl[];
export enum ESeoAction {
  Push = 'push',
  Update = 'update',
  Delete = 'delete',
}

const ActionNameMap = {
  [ESeoAction.Push]: '提交',
  [ESeoAction.Update]: '更新',
  [ESeoAction.Delete]: '删除',
};

@Injectable()
export class SeoService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  // 百度服务
  private pingBaidu(action: ESeoAction, urls: TUrl[]): void {

    const urlKeyMap = {
      [ESeoAction.Push]: 'urls',
      [ESeoAction.Update]: 'update',
      [ESeoAction.Delete]: 'del',
    };
    const urlKey = urlKeyMap[action];
    const actionText = `百度 ping [${ActionNameMap[action]}] 操作`;

    this.httpService.axiosRef
      .request({
        method: 'post',
        data: urls.join('\n'),
        headers: { 'Content-Type': 'text/plain' },
        url: `http://data.zz.baidu.com/${urlKey}?site=${APP_CONFIG.BAIDU.site}&token=${APP_CONFIG.BAIDU.token}`,
      })
      .then(response => {
        console.info(`${actionText}成功：`, urls, response.statusText);
      })
      .catch(error => {
        console.warn(`${actionText}失败：`, getMessageFromAxiosError(error));
      });
  }

  private humanizedUrl(url: TActionUrl): TUrl[] {
    return typeof url === 'string' ? [url] : url;
  }

  // 提交记录
  public push(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Push, urls);
  }

  // 更新记录
  public update(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Update, urls);
  }

  // 删除记录
  public delete(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Delete, urls);
  }
}
