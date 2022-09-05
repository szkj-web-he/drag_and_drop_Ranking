/**
 * @file
 * @date 2022-09-01
 * @author xuejie.he
 * @lastModify xuejie.he 2022-09-01
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => {
        Temp.displayName = "Btn";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/

        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/
        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
        return (
            <div className={`btn_wrap${className ? ` ${className}` : ""}`} ref={ref} {...props}>
                {children}
            </div>
        );
    },
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
Temp.displayName = "Btn";
export default Temp;
