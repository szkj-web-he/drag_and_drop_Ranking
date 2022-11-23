import "./font.scss";
import "./style.scss";

import React, { useEffect, useRef, useState } from "react";
import { deepCloneData, OptionProps, ParkingProps } from "./unit";

import { ConfigYML, PluginComms } from "@possie-engine/dr-plugin-sdk";
import { BoxItem, DragContext } from "./dragContext";
import Parking from "./Parking";
import { ScrollComponent } from "./Scroll";
import { Warehouse } from "./warehouse";
import Header from "./header";

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
        //一维开放
        const options = comms.config.options ?? [];

        const data: Record<string, number | null> = {};
        for (let i = 0; i < options.length; i++) {
            const item = options[i];

            let value: number | null = null;
            for (let j = 0; j < placementList.length; ) {
                const _item = placementList[j];
                if (_item.value?.code === item.code) {
                    value = j + 1;
                    j = placementList.length;
                } else {
                    ++j;
                }
            }
            data[item.code] = value;
        }
        comms.state = data;
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
            <ScrollComponent
                hidden={{
                    x: true,
                }}
                bodyClassName="wrapperBody"
                className="wrapperScroll"
            >
                <Header />
                <DragContext.Provider value={{ boxes: boxesRef.current }}>
                    <Warehouse
                        list={list}
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                    />
                    <div className="hr" />

                    <Parking
                        list={placementList}
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                        activeId={activeId}
                    />
                </DragContext.Provider>
            </ScrollComponent>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
