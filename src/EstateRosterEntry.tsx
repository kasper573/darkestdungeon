import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Character} from "./ProfileData";
import {observer} from "mobx-react";

@observer
export class EstateRosterEntry extends React.Component<{
  character: Character,
  onSelect?: () => void
}> {
  render () {
    return (
      <li className={css(styles.entry)} onClick={this.props.onSelect}>
        {this.props.character.name} : {this.props.character.classInfo.name}
      </li>
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    backgroundColor: "blue"
  }
});
