import * as React from "react";
import {StatsInfo} from "../state/StaticState";
import {StatsText} from "./StatsText";
import {todo} from "../config/general";

export class ItemBreakdown extends React.Component {
  render () {
    return (
      <div>
        {todo}
        <StatsText stats={new StatsInfo("HP", "MAX HEALTH POINTS", 23)}/>
        <StatsText stats={new StatsInfo("DGE", "DODGE", 10)}/>
        <StatsText stats={new StatsInfo("PROT", "PROTECTION POINTS", 0)}/>
        <StatsText stats={new StatsInfo("SPD", "SPEED", 6)}/>
      </div>
    );
  }
}
