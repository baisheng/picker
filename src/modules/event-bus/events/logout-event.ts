import { RequestContext } from '@app/common/request-context';
import { BaseEvent } from '@app/modules/event-bus/base-event';
/**
 * @description
 * This event is fired when a user logs out via the shop or admin API `logout` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class LogoutEvent extends BaseEvent {
  constructor(public ctx: RequestContext) {
    super();
  }
}
