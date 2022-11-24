/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */

import React from "react";
import { OptionProps, PublicTempProps } from "./unit";
import { ScrollComponent } from "./Scroll";
import { Drag } from "./Drag";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */

/** This section will include all the interface for this tsx file */
export interface WarehouseProps extends PublicTempProps {
    list?: Array<OptionProps>;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<WarehouseProps> = ({ list, handleDragMove, handleDragEnd }) => {
    const arr = list ?? [];

    const content = (
        <div className="warehouse_body">
            <div className="placeholder" style={arr.length ? { display: "none" } : {}}>
                暂无可拖拽的选项
            </div>
            {arr.map((item) => {
                return (
                    <Drag
                        key={item.code}
                        activeClassName="gray"
                        className="dragItem"
                        handleDragMove={({ name }) => {
                            handleDragMove({
                                data: { ...item },
                                to: name,
                            });
                        }}
                        handleDragEnd={handleDragEnd}
                        portalClassName="dragPortal"
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: item.content,
                            }}
                        />
                    </Drag>
                );
            })}
        </div>
    );
    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span className={`warehouse_totalVal${arr.length ? "" : " red"}`}>
                    {arr.length}
                </span>
                项
            </div>

            <ScrollComponent
                className="warehouse_scrollWrap"
                bodyClassName="warehouse_scrollBody"
                hidden={{
                    x: true,
                }}
            >
                {content}
            </ScrollComponent>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
