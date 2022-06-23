import "./font.scss";
import "./style.scss";

import React, { useEffect, useRef, useState } from "react";
import { deepCloneData, OptionProps, ParkingProps } from "./unit";

import { PluginComms, ConfigYML } from "@possie-engine/dr-plugin-sdk";
import { isMobile } from "./isMobile";
import { Warehouse } from "./warehouse";
import Parking from "./Parking";
import { BoxItem, DragContext } from "./dragContext";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<{ code: string; content: string }>;
        column?: number;
        optionsInstruction?: string;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [mobileStatus, setMobileStatus] = useState(isMobile());

    const listRef = useRef(comms.config.options ? deepCloneData(comms.config.options) : []);
    const [list, setList] = useState([...listRef.current]);

    const placementListRef = useRef(
        (() => {
            const column = comms.config.column ?? 3;
            const arr: Array<ParkingProps> = [];
            for (let i = 0; i < column; i++) {
                arr.push({
                    id: `${i}`,
                });
            }
            return arr;
        })(),
    );
    const [placementList, setPlacementList] = useState([...placementListRef.current]);

    const boxesRef = useRef<Array<BoxItem>>([]);

    const selectDataRef = useRef<{
        to?: string;
        from?: string;
        value: OptionProps;
    }>();

    const [activeId, setActiveId] = useState<string>();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useEffect(() => {
        const fn = () => {
            setMobileStatus(isMobile());
        };

        window.addEventListener("resize", fn);
        fn();
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    useEffect(() => {
        const arr: (string | null)[] = [];
        for (let i = 0; i < placementList.length; i++) {
            const item = placementList[i];
            arr.push(item.value?.code ?? null);
        }
        comms.state = arr;
        console.log(JSON.stringify(arr));
    }, [placementList]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleDragMove = (res: { data: OptionProps; to?: string; from?: string }) => {
        selectDataRef.current = {
            from: res.from,
            to: res.to,
            value: {
                code: res.data.code,
                content: res.data.content,
            },
        };
        setActiveId(res.to);
    };

    const handleDragEnd = () => {
        const data = selectDataRef.current ? deepCloneData(selectDataRef.current) : undefined;

        setActiveId(undefined);
        selectDataRef.current = undefined;

        if (data?.to == data?.from) {
            return;
        }
        //这里是删除
        let n = -1;
        if (data?.from) {
            for (let i = 0; i < placementListRef.current.length; ) {
                const item = placementListRef.current[i];
                if (item.id === data.from) {
                    n = i;
                    i = placementListRef.current.length;
                } else {
                    ++i;
                }
            }
            if (n >= 0) {
                placementListRef.current[n].value = undefined;
            }
        }

        //这里是添加
        if (data?.to) {
            for (let i = 0; i < placementListRef.current.length; ) {
                const item = placementListRef.current[i];

                if (item.id === data.to) {
                    if (n >= 0 && item.value) {
                        placementListRef.current[n].value = {
                            code: item.value.code,
                            content: item.value.content,
                        };
                    }

                    item.value = {
                        code: data.value.code,
                        content: data.value.content,
                    };
                    i = placementListRef.current.length;
                } else {
                    ++i;
                }
            }
        }

        /**
         * 过滤掉选中的
         * 剩下的还原到上方的原始那一栏
         */
        const arr: Array<OptionProps> = [];
        const selectData: Record<string, true> = {};
        for (let i = 0; i < placementListRef.current.length; i++) {
            const item = placementListRef.current[i];
            if (item.value) {
                selectData[item.value.code] = true;
            }
        }
        const options = comms.config.options ?? [];
        for (let i = 0; i < options.length; i++) {
            const item = options[i];
            if (!selectData[item.code]) {
                arr.push({
                    code: item.code,
                    content: item.content,
                });
            }
        }

        listRef.current = [...arr];

        setList([...listRef.current]);
        setPlacementList([...placementListRef.current]);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={`wrapper`}>
            <div className="question">
                <div
                    className="questionContent"
                    dangerouslySetInnerHTML={{
                        __html: comms.config.question ?? "",
                    }}
                />
                <div
                    className="questionDes"
                    dangerouslySetInnerHTML={{
                        __html: `(${comms.config.instruction ?? ""})`,
                    }}
                />
            </div>
            <DragContext.Provider value={{ boxes: boxesRef.current }}>
                <Warehouse
                    list={list}
                    mobileStatus={mobileStatus}
                    handleDragMove={handleDragMove}
                    handleDragEnd={handleDragEnd}
                />

                <div className="hr" />
                <Parking
                    list={placementList}
                    mobileStatus={mobileStatus}
                    handleDragMove={handleDragMove}
                    handleDragEnd={handleDragEnd}
                    activeId={activeId}
                />
            </DragContext.Provider>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
