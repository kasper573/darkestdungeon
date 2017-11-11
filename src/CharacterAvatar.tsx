import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {SizeObserver} from "./SizeObserver";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {commonStyles} from "./config/styles";

@observer
export class CharacterAvatar extends React.Component<{src: string}> {
  @observable private width: number;

  render () {
    const dynamicStyle = {
      backgroundImage: `url(${this.props.src})`,
      width: this.width
    };

    return (
      <div
        className={css(styles.avatar, commonStyles.boxBorder)}
        style={dynamicStyle}
        onClick={this.onClick}>
        <SizeObserver onSizeChanged={(size) => this.width = size.height}/>
      </div>
    );
  }

  onClick = () => {

  }
}

const styles = StyleSheet.create({
  avatar: {
    flex: 1,
    backgroundSize: "cover",
    backgroundPosition: "50% 50%"
  }
});
