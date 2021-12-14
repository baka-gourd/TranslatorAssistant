import { Component } from "react";
import React from "react";
import { Button } from "@chakra-ui/react";

interface State {
    langFile?: Blob;
}

export default class FuncLang2json extends Component<State> {

    state: State = { langFile: undefined };

    lang = React.createRef<HTMLInputElement>();
    setLangFile() {
        if (this.lang === undefined) return;
        if (this.lang.current?.files === null) return;
        this.setState({ ...this.state, langFile: this.lang.current?.files[0] });
    }

    readFile(blob: Blob | undefined) {
        if (blob === undefined) return;
        const reader = new FileReader();
        reader.onload = () => { console.log(reader.result); }
        reader.readAsText(blob, "utf-8");
    }

    render() {
        return (
            <div>
                <input
                    type="file"
                    name="lang"
                    id="lang"
                    ref={this.lang}
                    accept=".lang"
                    onChange={() => this.setLangFile()}
                />
                <Button onClick={() => this.readFile(this.state.langFile)}>test</Button>
            </div>
        );
    }
}
