/*
 * @Author: fasthro
 * @Description: Socket 对 WebSocket 的封装, 加入了连接超时
 * @API https://developer.mozilla.org/en-US/docs/Web/API/Websockets_API
 * @Date: 2019-03-20 17:40:17
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class Socket {

    // websocket
    private m_ws: WebSocket;

    // 用于指定连接成功后的回调函数
    private m_onopen: Function;
    // 用于指定连接关闭后的回调函数
    private m_onclose: Function;
    // 用于指定当从服务器接受到信息时的回调函数
    private m_onmessage: Function;
    // 用于指定连接失败后的回调函数
    private m_onerror: Function;
    // 用于指定连接超时后的回调函数
    private m_ontimeout: Function;

    // 上下文
    private m_context: any;
    // 超时handle
    private m_timeoutHandle: any;

    /**
     * socket 状态
     * [-1 初始状态]
     * [ 0 连接中]
     * [ 1 已连接]
     * [ 2 关闭中]
     * [ 3 已关闭]
     */
    public get state(){
        if(this.m_ws == null || this.m_ws == undefined)
        {
            return -1;
        }
        return this.m_ws.readyState;
    }

    /**
     * 构造函数
     * @param context 回调上下文
     * @param onopen 连接成功后的回调函数
     * @param onclose 连接关闭后的回调函数
     * @param onmessage 从服务器接受到信息时的回调函数
     * @param onerror 连接失败后的回调函数
     * @param ontimeout 连接超时后的回调函数
     */
    constructor(context: any, onopen: Function, onclose: Function, onmessage: Function, onerror: Function, ontimeout: Function) {
        this.m_context = context;
        this.m_onopen = onopen;
        this.m_onclose = onclose;
        this.m_onmessage = onmessage;
        this.m_onerror = onerror;
        this.m_ontimeout = ontimeout;
    }

    /**
     * 建立连接
     * @param ip ip
     * @param port port
     * @param timeout 超时时间
     */
    public connect(ip: string, port: number, timeout: number) {
        if (!this.m_ws) {

            this.m_ws = new WebSocket(`ws://${ip}:${port}`);

            // 绑定回调函数
            this.m_ws.onopen = this.onopen.bind(this);
            this.m_ws.onclose = this.onclose.bind(this);
            this.m_ws.onmessage = this.onmessage.bind(this);
            this.m_ws.onerror = this.onerror.bind(this);

            // 清空超时Handle
            if (this.m_timeoutHandle) {
                clearTimeout(this.m_timeoutHandle);
            }
            // 启动超时
            this.m_timeoutHandle = setTimeout(this.ontimeout.bind(this), timeout);
        }
    }

    /**
     * 发送数据
     * @param data 文本字符串数据
     */
    public send(data: string) {
        if(this.m_ws)
        {
            if(this.m_ws.readyState == WebSocket.OPEN)
            {
                this.m_ws.send(data);
            }
        }
    }

    /**
     * 关闭连接
     */
    public close() {
        if(this.m_ws)
        {
            if(this.m_ws.readyState == WebSocket.OPEN)
            {
                this.m_ws.close();
            }
        }
    }

    /**
     * 销毁回收
     */
    public dispose() {
        // 清空超时 Handle
        if (this.m_timeoutHandle) {
            clearTimeout(this.m_timeoutHandle);
        }
        
        // 清理 websocke
        if(this.m_ws)
        {
            if(this.m_ws.readyState == WebSocket.OPEN)
            {
                this.m_ws.close();
            }
            this.m_ws.onopen = null;
            this.m_ws.onclose = null;
            this.m_ws.onmessage = null;
            this.m_ws.onerror = null;
            
            this.m_ws = null;
        }
        
        // 清理回调
        this.m_context = null;
        this.m_onopen = null;
        this.m_onclose = null;
        this.m_onerror = null;
        this.m_onmessage = null;
        this.m_ontimeout = null;
    }

    private onopen(e: Event) {
        if (this.m_onopen) {
            this.m_onopen.call(this.m_context, e);
        }
    }

    private onclose(e: CloseEvent) {
        if (this.m_onclose) {
            this.m_onclose.call(this.m_context, e);
        }
    }

    private onmessage(e: MessageEvent) {
        if (this.m_onmessage) {
            this.m_onmessage.call(this.m_context, e);
        }
    }

    private onerror(e: Event) {
        if (this.m_onerror) {
            this.m_onerror.call(this.m_context, e);
        }
    }

    private ontimeout() {
        if(!this.m_ws)
            return;

        if (this.m_ontimeout) {
            this.m_ontimeout.call(this.m_context);
        }
    }
}
