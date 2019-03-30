/*
 * @Author: fasthro
 * @Description: 任务
 * @Date: 2019-03-29 10:32:08
 */

module GTask {
    /**
     * 任务回调函数参数类型
     */
    export type TaskHandlerData = {
        progress?: number;
        isStart?: boolean;
        isCompleted?: boolean;
        isTimeout?: boolean;
        params?: any;
    }

    /**
     * 任务回调类型
     */
    export type TaskCallbackHandler = {
        handler(data: TaskHandlerData): void;       // 回调函数
        context: any;                               // 上下文
        params?: any;                               // 附加参数
    }

    /**
     * 任务接口
     */
    export abstract class BaseTask {

        // 任务开始 Handler
        public onStartHandler: TaskCallbackHandler;
        // 任务进度 Handler
        public onProgressHandler: TaskCallbackHandler;
        // 任务完成 Handler
        public onCompletedHandler: TaskCallbackHandler;
        // 任务失败 Handler
        public onErrorHandler: TaskCallbackHandler;

        // 任务名称
        protected m_taskName: string = "Task";

        // 超时时间 timeout < 0 无超时限制
        protected m_timeout: number = 1000;

        // 定时器Handler
        private m_timeoutHandler: any;
        // 任务开始计时
        private m_startTime: number = 0;
        // 任务结束计时
        private m_endTime: number = 0;

        // 是否已经开始
        protected m_isStart: boolean = false;
        // 是否已经完成
        protected m_isCompleted: boolean = false;
        // 当前进度
        protected m_progress: number = 0;

        /**
         * 开始任务
         */
        public start(): void {
            this.m_isStart = true;
            this.m_isCompleted = true;
            this.m_progress = 0;

            this.m_startTime = new Date().getTime();
            this.m_endTime = 0;

            let hdStart: TaskHandlerData = { isTimeout: false, isStart: true, isCompleted: false, progress: 0 };
            this.callListener(this.onStartHandler, hdStart);

            this.startTask();

            if (this.m_timeoutHandler)
                clearTimeout(this.m_timeoutHandler);

            if (this.m_timeout < 0)
                return;

            let self = this;
            this.m_timeoutHandler = setTimeout(() => {
                let hdTimeout: TaskHandlerData = { isTimeout: true, isStart: true, isCompleted: false, progress: 0 };
                self.callListener(self.onErrorHandler, hdTimeout);
            }, this.m_timeout);
        }

        /**
         * 重新开始任务
         */
        public restart(): void {
            this.cancel();
            this.start();
        }

        /**
         * 取消任务
         */
        public cancel(): void {
            this.m_isStart = false;
            this.m_isCompleted = false;
            this.m_progress = 0;

            if (this.m_timeoutHandler)
                clearTimeout(this.m_timeoutHandler);
        }

        /**
         * 开始任务,子类实现此方法
         */
        protected startTask(): void {

        }

        /**
         * 调用 callback Handle
         * @param listener 
         */
        protected callListener(listener: TaskCallbackHandler, data: TaskHandlerData = null): void {
            if (listener && listener.handler) {
                listener.handler.call(listener.context, data);
            }
        }

        /**
         * tostring
         */
        protected toString(): string {
            return `Task -> ${this.m_taskName} isStart:${this.m_isStart} isCompleted:${this.m_isCompleted} progress:${this.m_progress}`;
        }

        /**
         * 任务用时
         */
        protected useTimr(): number {
            if (this.m_startTime <= 0 || this.m_endTime <= 0) return -1;
            return this.m_endTime - this.m_startTime;
        }
    }

    /**
     * 任务队列
     */
    export class TaskQueu extends BaseTask {
        // 任务列表
        private m_tasks: BaseTask[] = [];
        // 当前任务索引
        private m_index: number = 0;

        protected startTask(): void {
            this.m_index = -1;
            this.nextTask();
        }

        public restart(): void {
            this.cancel();
            this.start();
        }

        public cancel(): void {
            for(let i = 0; i < this.m_tasks.length; i++)
            {
                this.m_tasks[i].cancel();
            }
        }

        public push(task: BaseTask): void {
            this.m_tasks.push(task);
        }

        private nextTask(): void {
            if (this.m_tasks.length > 0 && this.m_index < this.m_tasks.length) {
                this.m_index++;
                let task: BaseTask = this.m_tasks[this.m_index];
                task.onStartHandler = { handler: this.onTaskStart, context: this, params: task };
                task.onProgressHandler = { handler: this.onTaskProgress, context: this, params: task };
                task.onCompletedHandler = { handler: this.onTaskCompleted, context: this, params: task };
                task.onErrorHandler = { handler: this.onTaskError, context: this, params: task };
            }
            else {
                // 任务队列执行完成
                let chd: TaskHandlerData = { isStart: true, isCompleted: true, isTimeout: false, progress: 1 };
                this.callListener(this.onCompletedHandler, chd)
            }
        }

        private onTaskStart(data: TaskHandlerData): void {

        }

        private onTaskProgress(data: TaskHandlerData): void {
            // TODO 暂时这样写，以后会修改为根据每个任务的Progress来计算
            let phd: TaskHandlerData = {isStart: true, isCompleted: false, isTimeout: false, progress: this.m_index / this.m_tasks.length};
            this.callListener(this.onProgressHandler, phd);
        }

        private onTaskCompleted(data: TaskHandlerData): void {
            setTimeout(() => {
                this.nextTask();
            }, 0);
        }

        private onTaskError(data: TaskHandlerData): void {
            
        }
    }

    /**
     * Sample 任务
     */
    class SampleTask extends BaseTask {
        constructor() {
            super();
            this.m_taskName = "Sample";
            this.m_timeout = 10000;
        }

        protected startTask(): void {
            let hd: TaskHandlerData = { isStart: true, isCompleted: true, isTimeout: false, progress: 1 };
            this.callListener(this.onCompletedHandler, hd)
        }
    }
}

export = GTask
