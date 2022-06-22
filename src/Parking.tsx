/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useLayoutEffect, useMemo, useState } from "react";
import { comms } from ".";
import { Drag } from "./Drag";
import { DragBox } from "./DragBox";
import { ScrollComponent } from "./Scroll";
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
const Temp: React.FC<TempProps> = ({ list, mobileStatus, activeId }) => {
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
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            let index = -1;
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
            <div className="parking_head">{comms.config.optionsInstruction}</div>

            <div className="parking_container">
                {arr.map((row, n) => {
                    return (
                        <div key={`row${n}`} className="parking_list">
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

                                    if (n < 5) {
                                        classList.push("parking_item__border");
                                    }
                                } else {
                                    width = `calc(100% / ${list.length})`;

                                    if (n < list.length - 1) {
                                        classList.push("parking_item__border");
                                    }
                                }

                                return (
                                    <DragBox
                                        className={classList.join(" ")}
                                        key={item.id}
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
                                                className="dragItem parking_value"
                                                portalClassName="dragPortal"
                                            >
                                                <span
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
            {mobileStatus ? (
                <div className="parking_mobileWrap">{content}</div>
            ) : (
                <ScrollComponent bodyClassName="parking_scrollBody" hidden={{ x: true }}>
                    {content}
                </ScrollComponent>
            )}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
