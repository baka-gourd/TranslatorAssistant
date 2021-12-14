import { Alert, AlertDescription, AlertIcon, HStack } from "@chakra-ui/react";
import { Component } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Counter } from "../counter/Counter";
import MainDesc from "../main-desc/MainDesc";
import styles from "./MainPage.module.css";
import FuncLang2json from '../func-lang2json/FuncLang2json';

export default class MainPage extends Component {
  render() {
    return (
      <div className="container mx-auto">
        <Alert status="warning" className={styles.warnAlert}>
          <AlertIcon />
          <AlertDescription>
            The tool is still under development, note the update.
          </AlertDescription>
        </Alert>
        <h1 className="text-4xl mt-4">test</h1>
        <HStack spacing={3} className="mx-auto w-1/2">
          <NavLink to="/" className={styles.navLink}>
            介绍
          </NavLink>
          <NavLink to="/test" className={styles.navLink}>
            test
          </NavLink>
          <NavLink to="/l2j" className={styles.navLink}>
            l2j
          </NavLink>
        </HStack>
        <Routes>
          <Route path="test" element={<Counter />}></Route>
          <Route path="/" element={<MainDesc />}></Route>
          <Route path="/l2j" element={<FuncLang2json />}></Route>
        </Routes>
      </div>
    );
  }
}
