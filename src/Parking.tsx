/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { comms } from ".";
import { Drag } from "./Drag";
import { DragBox } from "./DragBox";
import headBg from "./Image/icon_containerTop.png";
import headLeft from "./Image/icon_containerTopLeft.png";
import headRight from "./Image/icon_containerTopRight.png";
import ParkingBg from "./ParkingBg";
import { ParkingProps, PublicTempProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps extends PublicTempProps {
    list: Array<ParkingProps>;

    activeId?: string;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ list, activeId, handleDragMove, handleDragEnd }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    let arr: Array<Array<ParkingProps>> = [];
    if (list.length > 6) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!(i % 6)) {
                ++index;
                arr[index] = [item];
            } else {
                arr[index].push(item);
            }
        }
    } else {
        arr = [list];
    }

    const content = (
        <div className="parking_main">
            <ParkingBg />

            <div className="parking_container">
                {arr.map((row, n) => {
                    const active = row.some((item) => item.id === activeId);

                    return (
                        <div key={`row${n}`} className={`parking_list${active ? " active" : ""}`}>
                            {row.map((item, index) => {
                                const classList = ["parking_item"];
                                if (item.value) {
                                    classList.push("parking_item__fill");
                                }
                                if (activeId === item.id) {
                                    classList.push("parking_item__active");
                                }

                                let width: string;
                                if (list.length > 6) {
                                    width = "calc(100% / 6)";
                                    if (index < 5) {
                                        classList.push("parking_item__border");
                                    }
                                } else {
                                    width = `calc(100% / ${list.length})`;

                                    if (index < list.length - 1) {
                                        classList.push("parking_item__border");
                                    }
                                }

                                return (
                                    <DragBox
                                        className={classList.join(" ")}
                                        key={item.id}
                                        id={item.id}
                                        style={{
                                            width,
                                        }}
                                    >
                                        <div className="parking_placeholder">
                                            {n * 6 + index + 1}
                                        </div>
                                        {item.value && (
                                            <Drag
                                                value={{
                                                    code: item.value.code,
                                                    content: item.value.content,
                                                }}
                                                activeClassName="gray"
                                                handleDragMove={({ name }) => {
                                                    if (item.value) {
                                                        handleDragMove({
                                                            data: {
                                                                code: item.value.code,
                                                                content: item.value.content,
                                                            },
                                                            to: name,
                                                            from: item.id,
                                                        });
                                                    }
                                                }}
                                                handleDragEnd={handleDragEnd}
                                                handleDragCancel={handleDragEnd}
                                            >
                                                <span
                                                    className="dragContent"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.value.content,
                                                    }}
                                                />
                                            </Drag>
                                        )}
                                    </DragBox>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="parking_wrap">
            <div className="parking_head">
                <div className="parking_headBgContainer">
                    <img src={headBg} alt="" className="parking_headBg" />
                    <img src={headLeft} alt="" className="parking_headLeft" />
                    <img src={headRight} alt="" className="parking_headRight" />
                </div>
                <div className="headContent">
                    <div className="headContent_value">{comms.config.optionsInstruction}</div>
                </div>
            </div>
            {content}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
