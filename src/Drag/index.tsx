/**
 * @file Drag
 * @date 2022-06-22
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-22
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DragMoveProps, DragPramsProps, OptionProps, PointProps } from "../unit";
import { stopSelect } from "../Scroll/Unit/noSelected";
import { getScrollValue } from "../getScrollValue";
import { BoxItem, useDragContext } from "../dragContext";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface DragProps extends React.HTMLAttributes<HTMLDivElement> {
    handleDragStart?: (res: DragPramsProps) => void;

    handleDragMove?: (res: DragMoveProps) => void;

    handleDragEnd?: (res: DragPramsProps) => void;

    children?: React.ReactNode;

    value: OptionProps;

    portalClassName?: string;

    portalStyle?: React.CSSProperties;

    activeClassName?: string;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Drag = forwardRef<HTMLDivElement, DragProps>(
    (
        {
            children,
            handleDragStart,
            handleDragEnd,
            handleDragMove,
            onMouseDown,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            activeClassName,
            value,
            portalClassName,
            portalStyle,
            className,
            ...props
        },
        ref,
    ) => {
        Drag.displayName = "Drag";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        const mouseDownStatus = useRef(false);

        const touchStartStatus = useRef(false);

        const selectedFn = useRef<typeof document.onselectstart>(null);

        const point = useRef<PointProps>({
            offsetX: 0,
            offsetY: 0,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        const [position, setPosition] = useState<PointProps>();

        const valueRef = useRef<OptionProps>({
            code: value.code,
            content: value.content,
        });

        const { boxes } = useDragContext();

        const timer = useRef<number>();

        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/
        useLayoutEffect(() => {
            valueRef.current = {
                code: value.code,
                content: value.content,
            };
        }, [value]);

        useEffect(() => {
            return () => {
                timer.current && window.clearTimeout(timer.current);
            };
        }, []);

        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/
        /**
         * 匹配当前处在哪个盒子上
         */
        const matchBox = (
            clientX: number,
            clientY: number,
            callback: (res: BoxItem | null) => void,
        ) => {
            timer.current && window.clearTimeout(timer.current);

            timer.current = window.setTimeout(() => {
                const els = document.elementsFromPoint(clientX, clientY);

                let data: BoxItem | null = null;
                for (let j = 0; j < boxes.length; ) {
                    const item = boxes[j];

                    for (let i = 0; i < els.length; ) {
                        if (["HTML", "BODY"].includes(els[i].tagName)) {
                            ++i;
                        } else if (els[i] === item.el) {
                            data = {
                                el: item.el,
                                id: item.id,
                            };
                            i = els.length;
                        } else {
                            ++i;
                        }
                    }
                    if (data) {
                        j = boxes.length;
                    } else {
                        ++j;
                    }
                }
                callback(data);
            });
        };

        /**
         * 移动的通用事件
         */
        const handleMove = (x: number, y: number, clientX: number, clientY: number) => {
            point.current.x = x - point.current.offsetX;
            point.current.y = y - point.current.offsetY;
            matchBox(clientX, clientY, (res) => {
                handleDragMove?.({
                    x,
                    y,
                    clientX,
                    clientY,
                    name: res?.id,
                });
            });

            setPosition({
                ...point.current,
            });
        };

        /**
         * 鼠标移动
         */
        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.pageX, e.pageY, e.clientX, e.clientY);
        };

        // 当鼠标 或者手 弹起时的通用事件
        const handleUp = (x: number, y: number, clientX: number, clientY: number) => {
            timer.current && window.clearTimeout(timer.current);
            handleDragEnd?.({ x, y, clientX, clientY });

            document.onselectstart = selectedFn.current;
            point.current = {
                x: 0,
                y: 0,
                offsetX: 0,
                offsetY: 0,
                width: 0,
                height: 0,
            };
            setPosition(undefined);
            selectedFn.current = null;
        };

        /**
         * 鼠标松开
         */
        const handleMouseUp = (e: MouseEvent) => {
            handleUp(e.pageX, e.pageY, e.clientX, e.clientY);
            mouseDownStatus.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        // 手或者鼠标 按下的通用事件
        const handleDown = (
            e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
        ) => {
            stopSelect(e, selectedFn, true);

            const scrollData = getScrollValue();
            const rect = e.currentTarget.getBoundingClientRect();
            const rectX = rect.left + scrollData.x;
            const rectY = rect.top + scrollData.y;

            let x = 0;
            let y = 0;
            if ("pageX" in e) {
                x = e.pageX;
                y = e.pageY;
                handleDragStart?.({
                    x,
                    y,
                    clientX: e.clientX,
                    clientY: e.clientY,
                });
            } else {
                const position = e.changedTouches[0];
                x = position.pageX;
                y = position.pageY;
                handleDragStart?.({
                    x,
                    y,
                    clientX: position.clientX,
                    clientY: position.clientY,
                });
            }

            point.current = {
                offsetX: x - rectX,
                offsetY: y - rectY,
                x: rectX,
                y: rectY,
                width: rect.width,
                height: rect.height,
            };
            setPosition({
                ...point.current,
            });
        };

        /**
         * 鼠标按下
         */
        const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
            onMouseDown?.(e);
            if (touchStartStatus.current) {
                return;
            }
            handleDown(e);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            mouseDownStatus.current = true;
        };

        /**
         * 触摸开始
         */
        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
            onTouchStart?.(e);
            if (mouseDownStatus.current) {
                return;
            }
            handleDown(e);
            touchStartStatus.current = true;
        };

        /**
         * 移动触摸
         */
        const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
            onTouchMove?.(e);

            if (!touchStartStatus.current) {
                return;
            }
            const position = e.changedTouches[0];
            handleMove(position.pageX, position.pageY, position.clientX, position.clientY);
        };

        /**
         * 触摸结束
         */
        const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
            onTouchEnd?.(e);

            if (!touchStartStatus.current) {
                return;
            }
            const position = e.changedTouches[0];
            handleUp(position.pageX, position.pageY, position.clientX, position.clientY);
            touchStartStatus.current = false;
        };

        /**
         * 失焦时
         */
        // const handleBlur = () => {
        //     timer.current && window.clearTimeout(timer.current);
        //     document.onselectstart = selectedFn.current;
        //     point.current = {
        //         x: 0,
        //         y: 0,
        //         offsetX: 0,
        //         offsetY: 0,
        //         width: 0,
        //         height: 0,
        //     };
        //     setPosition(undefined);
        //     selectedFn.current = null;
        //     touchStartStatus.current = false;
        //     mouseDownStatus.current = false;
        //     document.removeEventListener("mousemove", handleMouseMove);
        //     document.removeEventListener("mouseup", handleMouseUp);
        // };

        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
        const classList: string[] = [];
        className && classList.push(className);

        if (position && activeClassName) {
            classList.push(activeClassName);
        }
        return (
            <>
                <div
                    {...props}
                    ref={ref}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={classList.join(" ")}
                >
                    {children}
                </div>
                {!!position &&
                    createPortal(
                        <div
                            className={
                                "dragPortalContainer" +
                                (portalClassName ? ` ${portalClassName}` : "")
                            }
                            style={{
                                ...portalStyle,
                                left: `${position.x}px`,
                                top: `${position.y}px`,
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                            }}
                            dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
                        >
                            {children}
                        </div>,
                        document.querySelector("body>div") ?? document.body,
                    )}
            </>
        );
    },
);

/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
Drag.displayName = "Drag";
