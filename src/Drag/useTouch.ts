import React, { useLayoutEffect, useRef } from "react";
import { useMobile } from "../Scroll/Unit/useMobile";
import { autoScroll, AutoScrollProps } from "../unit";

interface PointProp {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
}

export const useTouch = (
    handleStart: (res: PointProp) => void,
    handleMove: (res: PointProp) => void,
    handleEnd: (res: PointProp) => void,
    handleCancel: () => void,
): React.MutableRefObject<HTMLDivElement | null> => {
    const ref = useRef<HTMLDivElement | null>(null);
    const mobileStatus = useMobile();

    const selectedFn = useRef<typeof document.onselectstart>(null);
    /**
     * 开始的事件
     */
    const startFn = useRef(handleStart);
    /**
     * 结束的事件
     */
    const endFn = useRef(handleEnd);
    /**
     * 移动事件
     */
    const moveFn = useRef(handleMove);
    /**
     * 取消事件
     */
    const cancelFn = useRef(handleCancel);

    useLayoutEffect(() => {
        startFn.current = handleStart;
    }, [handleStart]);
    useLayoutEffect(() => {
        endFn.current = handleEnd;
    }, [handleEnd]);
    useLayoutEffect(() => {
        moveFn.current = handleMove;
    }, [handleMove]);
    useLayoutEffect(() => {
        cancelFn.current = handleCancel;
    }, [handleCancel]);

    /**
     * 移动端事件
     */
    useLayoutEffect(() => {
        const node = ref.current;
        const options: AddEventListenerOptions = {
            passive: false,
            capture: true,
        };
        const scrollData: AutoScrollProps = {
            direction: 0,
            timer: null,
        };

        const removeHandle = () => {
            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.timer = null;
            scrollData.direction = 0;
            document.removeEventListener("touchmove", handleTouchMove, options);
            document.removeEventListener("touchend", handleTouchEnd, options);
            document.removeEventListener("touchcancel", handleTouchCancel, options);
            if (!node) {
                return;
            }
            node.removeAttribute("style");
        };

        /**
         * touchmove
         */
        const handleTouchMove = (e: TouchEvent) => {
            if (!e.cancelable) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            const { pageX, pageY, clientX, clientY } = e.changedTouches[0];

            moveFn.current({
                pageX,
                pageY,
                clientX,
                clientY,
            });
            //这里自动向下滚动
            autoScroll(clientY, scrollData);
        };

        /**
         * touchend
         * @param e
         * @returns
         */
        const handleTouchEnd = (e: TouchEvent) => {
            removeHandle();

            endFn.current({
                pageX: e.changedTouches[0].pageX,
                pageY: e.changedTouches[0].pageY,
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY,
            });
        };

        const handleTouchCancel = () => {
            removeHandle();

            cancelFn.current();
        };

        /**
         * 开始触摸
         */
        const handleTouchStart = (e: TouchEvent) => {
            if (!e.cancelable) {
                return true;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.direction = 0;
            scrollData.timer = null;

            startFn.current({
                pageX: e.changedTouches[0].pageX,
                pageY: e.changedTouches[0].pageY,
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY,
            });

            document.addEventListener("touchmove", handleTouchMove, options);
            document.addEventListener("touchend", handleTouchEnd, options);
            document.addEventListener("touchcancel", handleTouchCancel, options);
        };

        if (mobileStatus) {
            node?.addEventListener("touchstart", handleTouchStart, options);
            return () => {
                removeHandle();
                node?.removeEventListener("touchstart", handleTouchStart, options);
            };
        }
        return () => {
            scrollData.timer && window.clearTimeout(scrollData.timer);
        };
    }, [mobileStatus]);

    /**
     * 桌面端事件
     */
    useLayoutEffect(() => {
        const node = ref.current;

        const scrollData: AutoScrollProps = {
            direction: 0,
            timer: null,
        };
        const removeHandle = () => {
            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.timer = null;
            document.removeEventListener("mousemove", handleMouseMove, true);
            document.removeEventListener("mouseup", handleMouseUp, true);
            window.removeEventListener("blur", handleMouseCancel, true);
            document.onselectstart = selectedFn.current;
            selectedFn.current = null;
            scrollData.direction = 0;
        };

        const removeSelect = (e: MouseEvent) => {
            e.stopImmediatePropagation();
            window.getSelection()?.removeAllRanges();
            selectedFn.current = document.onselectstart;
            document.onselectstart = () => false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { pageX, pageY, clientX, clientY } = e;

            moveFn.current({
                pageX,
                pageY,
                clientX,
                clientY,
            });
            //这里自动向下滚动

            autoScroll(clientY, scrollData);
        };

        const handleMouseUp = (e: MouseEvent) => {
            endFn.current({
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX,
                clientY: e.clientY,
            });
            removeHandle();
        };

        const handleMouseCancel = () => {
            cancelFn.current();
            removeHandle();
        };

        const handleMouseDown = (e: MouseEvent) => {
            removeSelect(e);
            startFn.current({
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX,
                clientY: e.clientY,
            });
            scrollData.timer && window.clearTimeout(scrollData.timer);
            scrollData.timer = null;
            scrollData.direction = 0;
            document.addEventListener("mousemove", handleMouseMove, true);
            document.addEventListener("mouseup", handleMouseUp, true);
            window.addEventListener("blur", handleMouseCancel, true);
        };

        if (!mobileStatus) {
            node?.addEventListener("mousedown", handleMouseDown, true);
            return () => {
                scrollData.timer && window.clearTimeout(scrollData.timer);
                node?.removeEventListener("mousedown", handleMouseDown, true);
            };
        }
    }, [mobileStatus]);

    return ref;
};
