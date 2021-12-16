import { Component, createRef } from "react";
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

interface State {
    langFile?: File;
    lang?: string;
    isLoading?: boolean;
}

interface jFile {
    [key: string]: string;
}

export default class FuncLang2json extends Component<State> {
    state: State = { langFile: undefined, lang: undefined, isLoading: false };

    lang = createRef<HTMLInputElement>();
    loadBtn = createRef<HTMLButtonElement>();

    toast = createStandaloneToast();
    setLangFile() {
        if (this.lang === undefined) return;
        if (this.lang.current?.files === null) return;
        this.setState({ ...this.state, langFile: this.lang.current?.files[0] });
    }

    readFile(file: File | undefined) {
        this.setState({ ...this.state, isLoading: true });
        if (file === undefined) {
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
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                ...this.state,
                lang: reader.result,
                isLoading: false,
            });
        };
        reader.readAsText(file, "utf-8");
    }

    generateJson() {
        if (this.state.lang === undefined) {
            this.toast({
                title: "生成文件失败",
                description: "无法读取文件信息，请检查是否已加载文件！",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const lines = this.state.lang.split("\n");
        let obj: jFile = {};
        lines.forEach((line) => {
            let trimed = line.trim();
            if (trimed === "") return;
            if (trimed.startsWith("#")) return;
            if (trimed.startsWith("//")) return;
            let arr = line.split("=");
            obj[arr[0]] = arr[1];
        });

        let blob = new Blob([JSON.stringify(obj, null, "\t")], {
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
                        ref={this.lang}
                        accept=".lang"
                        onChange={() => this.setLangFile()}
                    />
                    <Button
                        onClick={() => this.readFile(this.state.langFile)}
                        colorScheme="blue"
                        loadingText="读取中..."
                        ref={this.loadBtn}
                        isLoading={this.state.isLoading}
                        isDisabled={this.state.langFile === undefined}>
                        读取文件
                    </Button>
                    <Button
                        onClick={() => this.generateJson()}
                        colorScheme="green">
                        下载Json
                    </Button>
                </HStack>
                <Table variant="simple" size="sm">
                    {this.state.lang !== undefined && (
                        <Thead>
                            <Tr>
                                <Th>Key</Th>
                                <Th>Value</Th>
                            </Tr>
                        </Thead>
                    )}
                    <Tbody>
                        {this.state.lang?.split("\n").map((s, index) => {
                            if (s.trim() === "") return null;
                            const arr = s.split("=");
                            return (
                                <Tr key={index}>
                                    <Td>{arr[0]}</Td>
                                    <Td>{arr[1]}</Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </div>
        );
    }
}
