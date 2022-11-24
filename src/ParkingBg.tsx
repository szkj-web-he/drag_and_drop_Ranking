/**
 * @file
 * @date 2022-09-05
 * @author xuejie.he
 * @lastModify xuejie.he 2022-09-05
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const ref = useRef<HTMLCanvasElement | null>(null);

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            const c = ref.current;
            if (!c) {
                return;
            }
            const parent = c.parentElement;
            if (!parent) {
                return;
            }
            ctxRef.current?.clearRect(
                0,
                0,
                ctxRef.current.canvas.width,
                ctxRef.current.canvas.height,
            );

            const width = parent.offsetWidth;
            const height = parent.offsetHeight;

            c.width = width;
            c.height = height;

            ctxRef.current = c.getContext("2d");
            console.log("start");
            if (!ctxRef.current) {
                return;
            }

            // start draw
            ctxRef.current.beginPath();

            ctxRef.current.strokeStyle = "#0AD7E4";
            ctxRef.current.lineWidth = 2;

            ctxRef.current.moveTo(1, 42);
            ctxRef.current.lineTo(1, height - 60);
            ctxRef.current.lineTo(24, height - 22);
            ctxRef.current.lineTo(140, height - 22);
            ctxRef.current.lineTo(153, height - 1);
            ctxRef.current.lineTo(width - 106, height - 1);
            ctxRef.current.lineTo(width - 99, height - 14);
            ctxRef.current.lineTo(width - 26, height - 14);
            ctxRef.current.lineTo(width - 26, height - 14);
            ctxRef.current.lineTo(width - 1, height - 56);
            ctxRef.current.lineTo(width - 1, 28);
            ctxRef.current.lineTo(width - 18, 1);

            //左右肩的长度
            const leftOrRightLength = (width - 214 - 17 - 25) / 2;
            ctxRef.current.lineTo(leftOrRightLength + 25 + 214, 1);
            ctxRef.current.lineTo(leftOrRightLength + 25 + (214 - 5), 10);
            ctxRef.current.lineTo(leftOrRightLength + 25 + 5, 10);
            ctxRef.current.lineTo(leftOrRightLength + 25, 3);
            ctxRef.current.lineTo(25, 3);
            ctxRef.current.lineTo(1, 42);
            ctxRef.current.closePath();
            ctxRef.current.stroke();

            const fillColor = ctxRef.current.createLinearGradient(width - 92, 1, 91, height - 10);
            fillColor.addColorStop(0, "#D6F8FE");
            fillColor.addColorStop(1, "rgba(226,243,249,0.58)");
            ctxRef.current.fillStyle = fillColor;
            ctxRef.current.fill();
        };

        let timer: number | null = null;
        const resizeFn = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                timer = null;
                fn();
            });
        };

        resizeFn();
        window.addEventListener("resize", resizeFn);

        document.fonts.addEventListener("loading", resizeFn);

        const imgList = document.getElementsByTagName("img");
        for (let i = 0; i < imgList.length; i++) {
            const item = imgList[i];
            item.addEventListener("load", resizeFn);
        }

        return () => {
            window.removeEventListener("resize", resizeFn);
            timer && window.clearTimeout(timer);
            document.fonts.removeEventListener("loading", resizeFn);
            const imgList = document.getElementsByTagName("img");
            for (let i = 0; i < imgList.length; i++) {
                const item = imgList[i];
                item.removeEventListener("load", resizeFn);
            }
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return <canvas ref={ref} className="parkingBg" />;
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
