import { OnModuleDestroy } from '@nestjs/common';
import { Type } from '@app/common/shared-types';
import { BaseEvent } from './base-event';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export type EventHandler<T extends BaseEvent> = (event: T) => void;
// export type UnsubscribeFn = () => void;

/**
 * @description
 * EventBus 用于全局发布事件，然后可以订阅这些事件。
 *
 * @docsCategory events
 */
export class EventBus implements OnModuleDestroy {
  private subscriberMap = new Map<Type<BaseEvent>, Array<EventHandler<any>>>();
  private eventStream = new Subject<BaseEvent>();
  private destroy$ = new Subject();

  /**
   * @description
   * 发布任何订阅者都可以响应的事件。
   */
  publish<T extends BaseEvent>(event: T): void {
    const eventType = (event as any).constructor;
    const handlers = this.subscriberMap.get(eventType);
    if (handlers) {
      const length = handlers.length;
      for (let i = 0; i < length; i++) {
        handlers[i](event);
      }
    }
    this.eventStream.next(event);
  }

  /**
   * @description
   * 返回给定类型的RxJS可观察事件流。
   */
  ofType<T extends BaseEvent>(type: Type<T>): Observable<T> {
    return this.eventStream.asObservable().pipe(
      takeUntil<T>(this.destroy$),
      filter(e => (e as any).constructor === type),
    ) as Observable<T>;
  }

  // /**
  //  * @description
  //  * Deprecated: use `ofType()` instead.
  //  *
  //  * 订阅指定的事件类型。返回一个可以使用的退订函数
  //  * 取消订阅事件的处理程序。
  //  *
  //  * @deprecated
  //  */
  // subscribe<T extends BaseEvent>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn {
  //   const handlers = this.subscriberMap.get(type) || [];
  //   if (!handlers.includes(handler)) {
  //     handlers.push(handler);
  //   }
  //   this.subscriberMap.set(type, handlers);
  //   return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler));
  // }

  /** @internal */
  onModuleDestroy(): any {
    this.destroy$.next();
  }
}
