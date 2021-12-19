import {
    Button,
    createStandaloneToast,
    HStack,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import download from "downloadjs";
import { Component } from "react";
import { createRef } from "react";

interface State {
    oldEn?: File;
    newEn?: File;
    oldZh?: File;
    oldZhObject?: string;
    isLoading?: boolean;
    dict?: Map<string, KeyPair>;
    tr?: any;
}

class KeyPair {
    old?: string;
    new?: string;
}

interface jFile {
    [key: string]: string;
}

export default class FuncJsonUpdate extends Component<State> {
    state: State = {
        oldEn: undefined,
        oldZh: undefined,
        newEn: undefined,
        oldZhObject: undefined,
        isLoading: false,
        dict: new Map<string, KeyPair>(),
        tr: [],
    };

    oldEn = createRef<HTMLInputElement>();
    newEn = createRef<HTMLInputElement>();
    oldZh = createRef<HTMLInputElement>();

    toast = createStandaloneToast();

    setOldEn() {
        if (this.oldEn === undefined) return;
        if (this.oldEn.current?.files === null) return;
        this.setState({ ...this.state, oldEn: this.oldEn.current?.files[0] });
    }
    setNewEn() {
        if (this.newEn === undefined) return;
        if (this.newEn.current?.files === null) return;
        this.setState({ ...this.state, newEn: this.newEn.current?.files[0] });
    }
    setOldZh() {
        if (this.oldZh === undefined) return;
        if (this.oldZh.current?.files === null) return;
        this.setState({ ...this.state, oldZh: this.oldZh.current?.files[0] });
    }

    loadFile() {
        this.setState({ ...this.state, isLoading: true });
        if (
            this.state.newEn === undefined ||
            this.state.oldEn === undefined ||
            this.state.oldZh === undefined
        ) {
            this.toast({
                title: "读取文件失败",
                description: "无法读取文件信息，请检查是否已加载文件！",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            this.setState({ ...this.state, isLoading: false });
            return;
        }

        const reader1 = new FileReader();
        const reader2 = new FileReader();
        const reader3 = new FileReader();
        reader1.onload = () => {
            let res = reader1.result?.toString();
            let dict = this.state.dict;
            if (dict === undefined) return;
            if (res === undefined) return;
            let o = JSON.parse(res);
            for (const key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    const element = o[key];
                    if (element === undefined) continue;
                    let a = element as string;
                    let pair = dict.get(a);
                    if (pair === undefined) pair = new KeyPair();
                    pair.old = key;
                    dict.set(a, pair);
                }
            }
            this.setState({ ...this.state, dict: dict });
            this.setState({ ...this.state, isLoading: false });
            this.updateTable();
        };
        reader2.onload = () => {
            let res = reader2.result?.toString();
            let dict = this.state.dict;
            if (dict === undefined) return;
            if (res === undefined) return;
            let o = JSON.parse(res);
            for (const key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    const element = o[key];
                    if (element === undefined) continue;
                    let a = element as string;
                    let pair = dict.get(a);
                    if (pair === undefined) pair = new KeyPair();
                    pair.new = key;
                    dict.set(a, pair);
                }
            }
            this.setState({ ...this.state, dict: dict });
            this.setState({ ...this.state, isLoading: false });
            this.updateTable();
        };
        reader3.onload = () => {
            let res = reader3.result?.toString();
            this.setState({ ...this.state, oldZhObject: res });
            this.setState({ ...this.state, isLoading: false });
            this.updateTable();
        };
        reader1.readAsText(this.state.oldEn);
        reader2.readAsText(this.state.newEn);
        reader3.readAsText(this.state.oldZh);
    }

    updateTable() {
        let tr: any[] = [];
        let dict = this.state.dict;
        if (dict === undefined) return;
        if (this.state.oldZhObject === undefined) return;
        let o = JSON.parse(this.state.oldZhObject);
        dict.forEach((value, key) => {
            tr.push(
                <Tr>
                    <Th>{key}</Th>
                    <Th>{value.old}</Th>
                    <Th>{value.new}</Th>
                    <Th>{o[value.old + ""]}</Th>
                </Tr>
            );
        });
        this.setState({ ...this.state, tr: tr });
    }

    generate() {
        if (this.state.dict === undefined) return;
        if (!(this.state.dict?.size > 0)) return;
        let res = this.state.oldZhObject;
        if (res === undefined) return;
        let result: jFile = {};
        let o = JSON.parse(res);
        this.state.dict.forEach((value, key) => {
            let v = o[value.old + ""];
            if (v === undefined || v === "") v = key;
            result[value.new + ""] = v;
        });

        let blob = new Blob([JSON.stringify(result, null, "\t")], {
            type: "text/json;charset=utf-8",
        });
        download(blob, "result.json", "text/json;charset=utf-8");
        this.toast({
            title: "正在下载",
            description: "下载已经开始，请稍等片刻。",
            status: "success",
            duration: 1500,
            isClosable: true,
        });
    }
    render() {
        return (
            <div>
                <HStack spacing={3} justify="center">
                    <div className="flex">
                        <p>旧的英文文件</p>
                        <input
                            type="file"
                            accept=".json"
                            ref={this.oldEn}
                            onChange={() => this.setOldEn()}
                        />
                    </div>
                    <div className="flex">
                        <p>新的英文文件</p>
                        <input
                            type="file"
                            accept=".json"
                            ref={this.newEn}
                            onChange={() => this.setNewEn()}
                        />
                    </div>
                    <div className="flex">
                        <p>旧的中文文件</p>
                        <input
                            type="file"
                            accept=".json"
                            ref={this.oldZh}
                            onChange={() => this.setOldZh()}
                        />
                    </div>
                </HStack>
                <HStack spacing={3} justify="center">
                    <Button
                        isLoading={this.state.isLoading}
                        loadingText="读取中"
                        isDisabled={
                            this.state.newEn === undefined ||
                            this.state.oldEn === undefined ||
                            this.state.oldZh === undefined
                        }
                        colorScheme="green"
                        onClick={() => this.loadFile()}>
                        读取
                    </Button>
                    <Button
                        isDisabled={
                            this.state.newEn === undefined ||
                            this.state.oldEn === undefined ||
                            this.state.oldZh === undefined
                        }
                        colorScheme="blue"
                        onClick={() => this.generate()}>
                        更新
                    </Button>
                </HStack>
                <Table>
                    {this.state.dict !== undefined &&
                        this.state.dict?.size > 0 && (
                            <Thead>
                                <Tr>
                                    <Th>Key</Th>
                                    <Th>旧</Th>
                                    <Th>新</Th>
                                    <Th>中</Th>
                                </Tr>
                            </Thead>
                        )}
                    <Tbody>{this.state.tr}</Tbody>
                </Table>
            </div>
        );
    }
}
