import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {SizeObserver} from "../lib/SizeObserver";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {commonStyles} from "../config/styles";

@observer
export class Avatar extends React.Component<{
  src: string,
  classStyle?: any,
  onClick?: () => void
}> {
  @observable private width: number;

  render () {
    const dynamicStyle = {
      backgroundImage: `url(${this.props.src})`,
      width: this.width
    };

    return (
      <div
        className={css(styles.avatar, commonStyles.boxBorder, this.props.classStyle)}
        style={dynamicStyle}
        onClick={this.props.onClick}>
        <SizeObserver onSizeChanged={(size) => this.width = size.height}/>
        {this.props.children}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    flex: "1 auto",
    backgroundSize: "cover",
    backgroundPosition: "50% 50%"
  }
});
