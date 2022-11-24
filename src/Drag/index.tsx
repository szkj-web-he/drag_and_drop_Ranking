/**
 * @file Drag
 * @date 2022-06-22
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-22
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BoxItem, useDragContext } from "../dragContext";
import { getScrollValue } from "../getScrollValue";
import { DragMoveProps, DragPramsProps, PointProps } from "../unit";
import { useTouch } from "./useTouch";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface DragProps extends React.HTMLAttributes<HTMLDivElement> {
    handleDragStart?: (res: DragPramsProps) => void;

    handleDragMove?: (res: DragMoveProps) => void;

    handleDragEnd?: (res: DragPramsProps) => void;

    handleDragCancel?: () => void;

    children?: React.ReactNode;

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
            handleDragCancel,
            activeClassName,
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

        const point = useRef<PointProps>({
            offsetX: 0,
            offsetY: 0,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        const [position, setPosition] = useState<PointProps>();

        const { boxes } = useDragContext();

        const timer = useRef<number>();

        const globalClass = useRef<HTMLStyleElement>();

        const cRef = useTouch(
            (res) => {
                //触摸开始
                handleDragStart?.({
                    x: res.pageX,
                    y: res.pageY,
                    clientX: res.clientX,
                    clientY: res.clientY,
                });

                const node = cRef.current;
                if (!node) {
                    return;
                }
                const pointerStyle = window.getComputedStyle(node, null).cursor;
                globalClass.current = document.createElement("style");
                globalClass.current.innerHTML = `
                *{
                    cursor:${pointerStyle} !important;
                }
                `;
                document.head.append(globalClass.current);

                const scrollData = getScrollValue();
                const rect = node.getBoundingClientRect();
                const rectX = rect.left + scrollData.x;
                const rectY = rect.top + scrollData.y;
                point.current = {
                    offsetX: res.pageX - rectX,
                    offsetY: res.pageY - rectY,
                    x: rectX,
                    y: rectY,
                    width: rect.width,
                    height: rect.height,
                };
                setPosition({
                    ...point.current,
                });
            },
            (res) => {
                //触摸中~
                timer.current && window.clearTimeout(timer.current);
                timer.current = window.setTimeout(() => {
                    const els = document.elementsFromPoint(res.clientX, res.clientY);

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
                    handleDragMove?.({
                        x: res.pageX,
                        y: res.pageY,
                        clientX: res.clientX,
                        clientY: res.clientY,
                        name: data?.id,
                    });
                });

                point.current.x = res.pageX - point.current.offsetX;
                point.current.y = res.pageY - point.current.offsetY;
                setPosition({
                    ...point.current,
                });
            },
            (res) => {
                //触摸结束
                handleDragEnd?.({
                    x: res.pageX,
                    y: res.pageY,
                    clientX: res.clientX,
                    clientY: res.clientY,
                });

                globalClass.current?.remove();
                globalClass.current = undefined;
                timer.current && window.clearTimeout(timer.current);
                point.current = {
                    x: 0,
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    width: 0,
                    height: 0,
                };
                setPosition(undefined);
            },
            () => {
                //触摸取消
                handleDragCancel?.();
                globalClass.current?.remove();
                globalClass.current = undefined;
                point.current = {
                    x: 0,
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    width: 0,
                    height: 0,
                };
                setPosition(undefined);
            },
        );

        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/

        useEffect(() => {
            return () => {
                timer.current && window.clearTimeout(timer.current);
                globalClass.current?.remove();
                globalClass.current = undefined;
            };
        }, []);

        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/

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
                    ref={(el) => {
                        cRef.current = el;
                        if (typeof ref === "function") {
                            ref(el);
                        } else if (ref !== null) {
                            (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                        }
                    }}
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
