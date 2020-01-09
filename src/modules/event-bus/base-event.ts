/**
 * @description
 * EventBus 系统使用的所有事件的基类。
 *
 * @docsCategory events
 */
export abstract class BaseEvent {
  public readonly createdAt: Date;

  protected constructor() {
    this.createdAt = new Date();
  }
}
