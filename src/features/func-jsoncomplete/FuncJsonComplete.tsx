import {
    Button,
    createStandaloneToast,
    HStack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import download from "downloadjs";
import { Component } from "react";
import { createRef } from "react";

class JsonArr {
    prev?: string;
    next?: string;
}

class Compare {
    [key: string]: JsonArr | undefined;
}

interface State {
    j1?: File;
    j2?: File;
    isLoading?: boolean;
    comp?: Compare;
    tr?: any;
}

interface jFile {
    [key: string]: string;
}

export default class FuncJsonComplete extends Component<State> {
    state: State = {
        j1: undefined,
        j2: undefined,
        isLoading: false,
        comp: undefined,
        tr: [],
    };

    j1 = createRef<HTMLInputElement>();
    j2 = createRef<HTMLInputElement>();

    toast = createStandaloneToast();

    setJ1() {
        if (this.j1 === undefined) return;
        if (this.j1.current?.files === null) return;
        this.setState({ ...this.state, j1: this.j1.current?.files[0] });
    }

    setJ2() {
        if (this.j2 === undefined) return;
        if (this.j2.current?.files === null) return;
        this.setState({ ...this.state, j2: this.j2.current?.files[0] });
    }

    loadFile() {
        this.setState({ ...this.state, isLoading: true });
        if (this.state.j1 === undefined || this.state.j2 === undefined) {
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
        reader1.onload = () => {
            let obj: Compare;
            if (this.state.comp === undefined) {
                obj = new Compare();
            } else {
                obj = this.state.comp;
            }
            let res = reader1.result?.toString();
            if (res === undefined) return;
            let o = JSON.parse(res);
            for (const key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    const element = o[key];
                    if (element === undefined) continue;
                    let a = element as string;
                    obj[key] = { ...obj[key], prev: a };
                }
            }
            this.setState({ ...this.state, comp: obj });
            this.updateTable();
        };
        reader2.onload = () => {
            let obj: Compare;
            if (this.state.comp === undefined) {
                obj = new Compare();
            } else {
                obj = this.state.comp;
            }
            let res = reader2.result?.toString();
            if (res === undefined) return;
            let o = JSON.parse(res);
            for (const key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    const element = o[key];
                    if (element === undefined) continue;
                    let a = element as string;
                    obj[key] = { ...obj[key], next: a };
                }
            }

            this.setState({ ...this.state, comp: obj, isLoading: false });
            this.updateTable();
        };
        reader1.readAsText(this.state.j1);
        reader2.readAsText(this.state.j2);
    }

    updateTable() {
        if (this.state.comp === undefined) return;
        let result = this.state.tr;
        result = [];
        for (const key in this.state.comp) {
            if (Object.prototype.hasOwnProperty.call(this.state.comp, key)) {
                const element = this.state.comp[key];
                if (element === undefined) continue;
                result.push(
                    <Tr key={key}>
                        <Td>{key}</Td>
                        <Td>{element.prev}</Td>
                        <Td>{element.next}</Td>
                    </Tr>
                );
            }
        }
        this.setState({ ...this.state, tr: result });
    }

    completeJson(mode: string) {
        if (this.state.comp === undefined) return;
        let result: jFile = {};
        for (const key in this.state.comp) {
            if (Object.prototype.hasOwnProperty.call(this.state.comp, key)) {
                const element = this.state.comp[key];
                if (element === undefined) continue;
                if (mode === "prev") {
                    if (element.prev === undefined) continue;
                    if (element.next === undefined) element.next = element.prev;
                    result[key] = element.next;
                }

                if (mode === "next") {
                    if (element.next === undefined) continue;
                    if (element.prev === undefined) element.prev = element.next;
                    result[key] = element.prev;
                }
            }
        }

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
                    <input
                        type="file"
                        ref={this.j1}
                        accept=".json"
                        onChange={() => this.setJ1()}
                    />
                    <input
                        type="file"
                        ref={this.j2}
                        accept=".json"
                        onChange={() => this.setJ2()}
                    />
                    <Button
                        isLoading={this.state.isLoading}
                        isDisabled={
                            this.state.j1 === undefined ||
                            this.state.j2 === undefined
                        }
                        loadingText="加载中"
                        colorScheme="blue"
                        onClick={() => this.loadFile()}>
                        加载
                    </Button>
                    <Button
                        colorScheme="green"
                        isDisabled={
                            this.state.j1 === undefined ||
                            this.state.j2 === undefined
                        }
                        onClick={() => this.completeJson("prev")}>
                        使用左侧文件补全右侧
                    </Button>
                    <Button
                        colorScheme="green"
                        isDisabled={
                            this.state.j1 === undefined ||
                            this.state.j2 === undefined
                        }
                        onClick={() => this.completeJson("next")}>
                        使用右侧文件补全左侧
                    </Button>
                </HStack>
                <Table variant="simple" size="sm">
                    {!(
                        this.state.j1 === undefined ||
                        this.state.j2 === undefined
                    ) && (
                        <Thead>
                            <Tr>
                                <Th>Key</Th>
                                <Th>Value1</Th>
                                <Th>Value2</Th>
                            </Tr>
                        </Thead>
                    )}
                    <Tbody>{this.state.tr}</Tbody>
                </Table>
            </div>
        );
    }
}
