import { HStack } from "@chakra-ui/react";
import { Component } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Counter } from "../counter/Counter";
import styles from "./MainPage.module.css";
import FuncLang2json from "../func-lang2json/FuncLang2json";
import FuncJsonComplete from "../func-jsoncomplete/FuncJsonComplete";
import FuncJsonUpdate from "../func-jsonupdate/FuncJsonUpdate";

export default class MainPage extends Component {
    render() {
        return (
            <div className="container mx-auto">
                {/* <Alert status="warning" className={styles.warnAlert}>
                    <AlertIcon />
                    <AlertDescription>
                        The tool is still under development, note the update.
                    </AlertDescription>
                </Alert> */}
                <h1 className="text-4xl mt-4">汉化小工具</h1>
                <HStack spacing={3} className="mx-auto w-1/2">
                    {/* <NavLink to="/" className={styles.navLink}>
                        介绍
                    </NavLink> */}
                    {/* <NavLink to="/test" className={styles.navLink}>
                        test
                    </NavLink> */}
                    <NavLink to="/l2j" className={styles.navLink}>
                        Lang转Json
                    </NavLink>
                    <NavLink to="/jc" className={styles.navLink}>
                        Json补全
                    </NavLink>
                    <NavLink to="/ju" className={styles.navLink}>
                        Json更新
                    </NavLink>
                </HStack>
                <Routes>
                    <Route path="test" element={<Counter />}></Route>
                    <Route path="/" element={<FuncLang2json />}></Route>
                    <Route path="/l2j" element={<FuncLang2json />}></Route>
                    <Route path="/jc" element={<FuncJsonComplete />}></Route>
                    <Route path="/ju" element={<FuncJsonUpdate />}></Route>
                </Routes>
            </div>
        );
    }
}
