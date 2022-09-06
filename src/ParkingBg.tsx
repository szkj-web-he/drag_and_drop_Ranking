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

            const width = parent.offsetWidth;
            const height = parent.offsetHeight;

            c.width = width;
            c.height = height;

            const ctx = c.getContext("2d");

            if (!ctx) {
                return;
            }

            // start draw
            ctx.beginPath();

            ctx.strokeStyle = "#0AD7E4";
            ctx.lineWidth = 2;

            ctx.moveTo(1, 42);
            ctx.lineTo(1, height - 60);
            ctx.lineTo(24, height - 22);
            ctx.lineTo(140, height - 22);
            ctx.lineTo(153, height);
            ctx.lineTo(width - 106, height);
            ctx.lineTo(width - 99, height - 14);
            ctx.lineTo(width - 26, height - 14);
            ctx.lineTo(width - 26, height - 14);
            ctx.lineTo(width - 1, height - 56);
            ctx.lineTo(width - 1, 28);
            ctx.lineTo(width - 18, 1);

            //左右肩的长度
            const leftOrRightLength = (width - 214 - 17 - 25) / 2;
            ctx.lineTo(leftOrRightLength + 25 + 214, 1);
            ctx.lineTo(leftOrRightLength + 25 + (214 - 5), 10);
            ctx.lineTo(leftOrRightLength + 25 + 5, 10);
            ctx.lineTo(leftOrRightLength + 25, 3);
            ctx.lineTo(25, 3);
            ctx.lineTo(1, 42);
            ctx.closePath();
            ctx.stroke();

            const fillColor = ctx.createLinearGradient(width - 92, 1, 91, height - 10);
            fillColor.addColorStop(0, "#D6F8FE");
            fillColor.addColorStop(1, "rgba(226,243,249,0.58)");
            ctx.fillStyle = fillColor;
            ctx.fill();
        };
        fn();
        window.addEventListener("resize", fn);

        document.fonts.addEventListener("loading", fn);
        return () => {
            window.removeEventListener("resize", fn);
            document.fonts.removeEventListener("loading", fn);
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
