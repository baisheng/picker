/**
 * @description
 * 当尝试 “login” 登录时，将触发此事件。
 *
 * @docsCategory events
 * @docsPage Event Types
 */
import { RequestContext } from '@app/common/request-context';
import { BaseEvent } from '@app/modules/event-bus/base-event';

export class AttemptedLoginEvent extends BaseEvent {
  constructor(public ctx: RequestContext, public identifier: string) {
    super();
  }
}
