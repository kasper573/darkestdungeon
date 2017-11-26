import * as React from "react";
import {ItemInfo} from "../state/types/ItemInfo";

export class HeirloomIcon extends React.Component<{
  info: ItemInfo
}> {
  render () {
    return (
      <span>[{this.props.info.name.substr(0, 1)}]</span>
    );
  }
}
