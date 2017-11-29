import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonStyles} from "../config/styles";
import {VerticalOutlineBox} from "./VerticalOutlineBox";
import {grid} from "../config/Grid";

export class CommonHeader extends React.Component<{label: string}> {
  render () {
    return (
      <div className={css(styles.commonHeader, commonStyles.commonName, commonStyles.nowrap)}>
        {this.props.label}
        <VerticalOutlineBox/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  commonHeader: {
    padding: grid.gutter,
    marginBottom: grid.gutter
  }
});
