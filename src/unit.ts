export interface OptionProps {
    code: string;
    content: string;
}

export interface PointProps {
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface DragPramsProps {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
}

export interface DragMoveProps extends DragPramsProps {
    name?: string;
}

export interface ParkingProps {
    id: string;
    value?: OptionProps;
}

export interface PublicTempProps {
    /**
     * 拖拽move的回调
     */
    handleDragMove: (res: { data: OptionProps; to?: string; from?: string }) => void;
    /**
     * 拖拽结束
     */
    handleDragEnd: () => void;
}

/**
 * @file 深克隆一下数据
 * @date 2022-06-14
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-14
 */

export const deepCloneData = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data)) as T;
};

export interface AutoScrollProps {
    /**
     * 滚动的方向
     * 0是没有
     * 1是向下
     * -1是向上
     */
    direction: 0 | 1 | -1;
    /**
     * 计时器
     */
    timer: number | null;
}

export const autoScroll = (clientY: number, scrollData: AutoScrollProps, delay = 500): void => {
    const el = document.getElementsByClassName("wrapperBody")[0];

    if (
        el instanceof HTMLElement &&
        clientY > window.innerHeight - 20 &&
        el.scrollHeight > el.scrollTop + el.offsetHeight
    ) {
        //向下
        if (scrollData.direction === 1 && scrollData.timer) {
            return;
        }
        scrollData.direction = 1;
        scrollData.timer && window.clearTimeout(scrollData.timer);
        scrollData.timer = window.setTimeout(() => {
            scrollData.timer = null;
            if (el.scrollHeight > el.scrollTop + el.offsetHeight) {
                el.scrollTop = el.scrollTop + 1;
                autoScroll(clientY, scrollData, 0);
            }
        }, delay);
    } else if (el instanceof HTMLElement && clientY < 20) {
        //向上
        if (scrollData.direction === -1 && scrollData.timer) {
            return;
        }
        scrollData.direction = -1;
        scrollData.timer && window.clearTimeout(scrollData.timer);
        scrollData.timer = window.setTimeout(() => {
            scrollData.timer = null;
            if (el.scrollTop > 0) {
                el.scrollTop = el.scrollTop - 1;
                autoScroll(clientY, scrollData, 0);
            }
        }, delay);
    } else {
        scrollData.direction = 0;
        scrollData.timer && window.clearTimeout(scrollData.timer);
    }
};
