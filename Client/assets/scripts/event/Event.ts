/*
 * @Author: fasthro
 * @Description: 事件系统
 * @Date: 2019-03-22 16:29:59
 */

const { ccclass, property } = cc._decorator;

export interface EventListener {
    callback: Function;
    target: any;
    once: boolean;
}

export interface EventType {
    [eventName: string]: EventListener[];
}

@ccclass
export class Event {

    // 单例模式
    private static _inst: Event;
    public static get inst() {
        return Event._inst || (Event._inst = new Event());
    }

    // 所有事件的监听器
    private m_events: EventType;

    constructor() {
        this.m_events = {}
    }

    public on(type: string, callback: Function, target?: any, once?: boolean) {
        if (!this.m_events[type]) {
            this.m_events[type] = [];
        }

        this.m_events[type].push({callback, target, once});
    }

    public once(type: string, callback: Function, target?: any): void {
        this.on(type, callback, target, true);
    }

    public emit(type: string, ...params: any[]): void {
        const listeners = this.m_events[type] || [];

        let len = listeners.length;

        for (let i = 0; i < len; i++) {
            const { callback, target, once } = listeners[i];

            callback.apply(target, params);

            if (once) {
                listeners.splice(i, 1);
                i--;
                i--;
            }
        }
    }

    public off(type: string, callback?: Function, target?: any): void {
        const listeners = this.m_events[type] || [];

        if (!callback) {
            delete this.m_events[type];
        }
        else {
            for (let i = 0; i < listeners.length; i++) {
                if (callback == listeners[i].callback && target == listeners[i].target) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
}

export var CEvent = Event.inst;
