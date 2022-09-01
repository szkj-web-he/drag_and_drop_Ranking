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
