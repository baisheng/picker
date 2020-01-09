import { EventBus } from './event-bus';
import { BaseEvent } from './base-event';

describe('EventBus', () => {
  let eventBus: EventBus;
  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('可以在没有订阅者的情况下发布', () => {
    const event = new TestEvent('foo');
    expect(() => eventBus.publish(event)).not.toThrow();
  });
  describe('ofType()', () => {
    it('单个处理程序只调用一次', () => {
      const handler = jest.fn();
      const event = new TestEvent('foo');
      eventBus.ofType(TestEvent).subscribe(handler);

      eventBus.publish(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('在多个事件上调用单个处理程序', () => {
      const handler = jest.fn();
      const event1 = new TestEvent('foo');
      const event2 = new TestEvent('bar');
      const event3 = new TestEvent('baz');
      eventBus.ofType(TestEvent).subscribe(handler);

      eventBus.publish(event1);
      eventBus.publish(event2);
      eventBus.publish(event3);

      expect(handler).toHaveBeenCalledTimes(3);
      expect(handler).toHaveBeenCalledWith(event1);
      expect(handler).toHaveBeenCalledWith(event2);
      expect(handler).toHaveBeenCalledWith(event3);
    });

    it('调用多个处理程序', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();
      const event = new TestEvent('foo');
      eventBus.ofType(TestEvent).subscribe(handler1);
      eventBus.ofType(TestEvent).subscribe(handler2);
      eventBus.ofType(TestEvent).subscribe(handler3);

      eventBus.publish(event);

      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);
      expect(handler3).toHaveBeenCalledWith(event);
    });

    it('不为其他事件调用处理程序', () => {
      const handler = jest.fn();
      const event = new OtherTestEvent('foo');
      eventBus.ofType(TestEvent).subscribe(handler);

      eventBus.publish(event);

      expect(handler).not.toHaveBeenCalled();
    });

    it('ofType() 返回一个订阅', () => {
      const handler = jest.fn();
      const event = new TestEvent('foo');
      const subscription = eventBus.ofType(TestEvent).subscribe(handler);

      eventBus.publish(event);

      expect(handler).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();

      eventBus.publish(event);
      eventBus.publish(event);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('unsubscribe() 只有取消订阅自己的处理程序', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const event = new TestEvent('foo');
      const subscription1 = eventBus.ofType(TestEvent).subscribe(handler1);
      const subscription2 = eventBus.ofType(TestEvent).subscribe(handler2);

      eventBus.publish(event);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      subscription1.unsubscribe();

      eventBus.publish(event);
      eventBus.publish(event);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(3);
    });
  });
});

class TestEvent extends BaseEvent {
  constructor(public payload: string) {
    super();
  }
}

class OtherTestEvent extends BaseEvent {
  constructor(public payload: string) {
    super();
  }
}
