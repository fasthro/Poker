import Socket from "../network/Socket";
import GameEnv from "../define/GameEnv";
import BaseManager from "./BaseManager";

/*
 * @Author: fasthro
 * @Description: 网络层管理器
 * @Date: 2019-03-21 11:39:54
 */

const { ccclass, property } = cc._decorator;

// 是否输出日志
const LOG_ENABLED: boolean = true;

@ccclass
export default class NetworkManager extends BaseManager implements IManager {
    
    // 连接超时时间
    private readonly timeout: number;
    // 最大重连次数
    private readonly reConnectMaxCount: number;
    // 尝试重连时间间隔
    private readonly reConnectTimeInterval: number;

    // socket
    private m_socket: Socket;
    // ip
    private m_ip: string;
    // port
    private m_port: number;
    // 重连次数
    private m_reConnectCount: number;
    // 重连Handle
    private m_reConnectHandle: any;

    constructor() {
        super();
        
        /**
         *  config
         */
        // 连接超时时间
        this.timeout = GameEnv.networkConnectTimeout;
        // 最大重连次数
        this.reConnectMaxCount = GameEnv.networkReConnectMaxCount;
        // 尝试重连时间间隔
        this.reConnectTimeInterval = GameEnv.networkReConnectTimeInterval;
    }

    /**
     * 创建
     */
    public static create(name: string): IManager {
        return new NetworkManager();
    }
    
    /**
     * 初始化
     */
    public initialize(): void {
        this.m_socket = null;
        this.m_reConnectCount = 0;
    }

    /**
     * 
     * @param dt 更新
     */
    public update(dt: any): void {

    }

    /**
     * 销毁回收
     */
    public dispose(): void {
        // 清理重连Handle
        if (this.m_reConnectHandle) {
            clearTimeout(this.m_reConnectHandle);
        }

        // 清理socket 对象
        if (this.m_socket) {
            this.m_socket.dispose();
        }
        this.m_socket = null;
    }

    /**
     * 连接状态
     */
    public get connectState() {
        if (this.m_socket) {
            return this.m_socket.state;
        }
        return -1;
    }

    /**
     * 建立连接
     * @param ip ip
     * @param port port
     */
    public connect(ip: string, port: number, connectCallback?: Function) {
        this.m_ip = ip;
        this.m_port = port;

        if (this.connectState == -1 || this.connectState == WebSocket.CLOSED) {
            if (!this.m_socket) {
                if (connectCallback) {
                    connectCallback = this.onConnect;
                }
                this.m_socket = new Socket(this, connectCallback, this.onClose, this.onMessage, this.onError, this.onTimeout);
            }
            this.m_socket.connect(ip, port, this.timeout);
        }
    }

    /**
     * 重新连接
     */
    public reConnect() {
        if (LOG_ENABLED) console.log(`network -> reConnect count:${this.m_reConnectCount}`);

        if (this.m_reConnectCount <= this.reConnectMaxCount) {
            this.m_reConnectCount++;
            this.connect(this.m_ip, this.m_port, this.onReConnect);
        }
        else {
            if (LOG_ENABLED) console.log("network -> reConnect failed");

            // 重置重连次数
            this.m_reConnectCount = 0;

            // TODO 弹出提示是否再次重新连接
        }
    }

    /**
     * 自动重连
     */
    private autoReConnect() {
        // 清理重连Handle
        if (this.m_reConnectHandle) {
            clearTimeout(this.m_reConnectHandle);
        }
        // 启动定时重连
        let self = this;
        this.m_reConnectHandle = setTimeout(() => {
            self.reConnect();
        }, this.reConnectTimeInterval);
    }

    public send(id: number, data: string) {
        if(LOG_ENABLED) console.log(`network -> send id:${id} data:${data}`);
        
        // 消息体
        let msg = { "id": id, "data": data };

        if (this.connectState == WebSocket.OPEN) {
            this.m_socket.send(JSON.stringify(msg));
        }
        else {
            // 回收销毁
            this.dispose();
            // 重新连接
            this.reConnect();
        }
    }

    private onConnect(e: Event) {
        if (LOG_ENABLED) console.log(`network -> onConnect succeed! ip:${this.m_ip} port:${this.m_port}`);

        // 重置重连次数
        this.m_reConnectCount = 0;
    }

    private onReConnect(e: Event) {
        if (LOG_ENABLED) console.log(`network -> onReConnect succeed! ip:${this.m_ip} port:${this.m_port}`);

        // 重置重连次数
        this.m_reConnectCount = 0;
    }

    private onMessage(e: MessageEvent) {
        if (LOG_ENABLED) console.log(`network -> onMessage! data:${e.data}`);
    }

    private onClose(e: CloseEvent) {
        if (LOG_ENABLED) console.log("network -> onClose!");
        // 回收销毁
        this.dispose();

        // 自动重连
        this.autoReConnect();
    }

    private onError(e: Event) {
        if (LOG_ENABLED) console.log(`network -> onError! error:${e}`);
        // 回收销毁
        this.dispose();

        // 自动重连
        this.autoReConnect();
    }

    private onTimeout() {
        if (LOG_ENABLED) console.log("network -> onTimeout!");

        // 回收销毁
        this.dispose();

        // 自动重连
        this.autoReConnect();
    }
}