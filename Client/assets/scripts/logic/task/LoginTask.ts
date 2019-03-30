import GTask = require("../../task/GTask");
/*
 * @Author: fasthro
 * @Description: 登录任务
 * @Date: 2019-03-29 14:38:24
 */

export default class LoginTask extends GTask.BaseTask {
    constructor() {
        super();
        this.m_taskName = "LoginTask";
        this.m_timeout = -1;
    }

    protected startTask(): void {
        let hd: GTask.TaskHandlerData = {isCompleted: true, progress: 1};
        this.callListener(this.onCompletedHandler, hd)
    }
}
