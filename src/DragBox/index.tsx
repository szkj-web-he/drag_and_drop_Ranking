/**
 * @file 放置拖拽物的盒子
 * @date 2022-06-22
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-22
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef, useLayoutEffect, useRef } from "react";
import { useDragContext } from "../dragContext";
import bg from "../Image/icon_boxBg.png";
import topIcon from "../Image/icon_row1.png";
import lastIcon from "../Image/icon_lastRow.png";
import joinIcon from "../Image/icon_noRow1.png";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface DragBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * key of this component
     */
    id: string;
    /**
     *
     */
    children?: React.ReactNode;

    /**
     * 下标
     */
    index: number;

    /**
     * 总量
     */
    total: number;
    /**
     * 有几列
     */
    colNumber: number;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const DragBox = forwardRef<HTMLDivElement, DragBoxProps>(
    ({ id, children, className, index, total, colNumber, ...props }, ref) => {
        DragBox.displayName = "DragBox";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        const cRef = useRef<HTMLDivElement | null>(null);

        const { boxes } = useDragContext();
        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/
        useLayoutEffect(() => {
            boxes.push({
                id,
                el: cRef.current,
            });
        }, [boxes, id]);

        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/
        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
        return (
            <div
                ref={(el) => {
                    cRef.current = el;
                    if (typeof ref === "function") {
                        ref(el);
                    } else if (ref !== null) {
                        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                    }
                }}
                className={`optionItem${className ? ` ${className}` : ""}`}
                {...props}
            >
                {index < colNumber ? (
                    <img src={topIcon} alt="" className="optionItem_topImage" />
                ) : (
                    <></>
                )}
                <img src={bg} alt="" className="optionItem_img" />
                <div className="optionItem_content">{children}</div>
                {index - colNumber >= 0 ? (
                    <img src={joinIcon} alt="" className="optionItem_joinImg" />
                ) : (
                    <></>
                )}
                {index + colNumber >= total ? (
                    <img src={lastIcon} alt="" className="optionItem_lastImg" />
                ) : (
                    <></>
                )}
            </div>
        );
    },
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
DragBox.displayName = "DragBox";
