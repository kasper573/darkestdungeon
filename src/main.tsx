import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";

const rootEl = document.createElement("div");

ReactDOM.render(<App/>, rootEl);

document.body.appendChild(rootEl);
