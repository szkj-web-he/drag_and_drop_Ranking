/**
 * @file
 * @date 2022-09-05
 * @author xuejie.he
 * @lastModify xuejie.he 2022-09-05
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import bgBottom from "./Image/bg_bottom.png";
import bgLeft from "./Image/bg_left.png";
import bgRight from "./Image/bg_right.png";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
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
        <div className="parkingBg_wrap">
            <div className="parkingBg_left">
                <img src={bgLeft} alt="" className="parkingBg_leftTop" />
                <div className="parkingBg_leftCenter" />
                <img src={bgBottom} alt="" className="parkingBg_leftBottom" />
            </div>
            <div className="parkingBg_center" />
            <div className="parkingBg_right">
                <div className="parkingBg_rightTop" />
                <img src={bgRight} alt="" className="parkingBg_rightBottom" />
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
