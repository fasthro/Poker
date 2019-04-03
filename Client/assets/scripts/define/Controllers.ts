import LoadingController from "../controller/LoadingController";
import MainCtroller from "../controller/MainController";
import InitController from "../controller/InitController";
import DDZCtroller from "../controller/DDZCtroller";

/*
 * @Author: fasthro
 * @Description: 控制器类型配置
 * @Date: 2019-03-26 16:11:04
 */

export enum ControllerType {
    Init,
    Loading,
    Main,
    DDZ,
}

export interface ControllerInfo {
    name: string;
    controller: any;
}

export default class ControllerInfos {
    // controller infos 
    public static infos: { [key: number]: ControllerInfo };

    /**
     * 初始化由Center负责调用
     */
    public static initialize(): void {
        this.infos = {}
        this.infos[ControllerType.Init] = { name: "init", controller: InitController };
        this.infos[ControllerType.Loading] = { name: "loading", controller: LoadingController };
        this.infos[ControllerType.Main] = { name: "main", controller: MainCtroller };
        this.infos[ControllerType.DDZ] = { name: "ddz", controller: DDZCtroller };
    }
}
