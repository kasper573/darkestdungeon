import * as React from "react";
import {css} from "aphrodite";
import {commonColors, commonStyles, Row} from "../config/styles";
import {Avatar} from "./Avatar";
import {StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {VerticalOutlineBox} from "./VerticalOutlineBox";

export class LargeHeader extends React.Component<{
  label: string,
  icon?: string,
  iconChildren?: any,
  onClick?: () => void
}> {
  render () {
    const icon = this.props.icon && (
      <Avatar src={this.props.icon} onClick={this.props.onClick}>
        {this.props.iconChildren}
      </Avatar>
    );
    return (
      <Row valign="center">
        {icon}
        <h1 className={css(styles.headerLabel, commonStyles.commonName)}>
          {this.props.label}
          <VerticalOutlineBox color={commonColors.gray}/>
        </h1>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  headerLabel: {
    marginTop: grid.gutter,
    marginBottom: grid.gutter,
    padding: grid.gutter,
    paddingRight: grid.gutter * 2,
    background: "linear-gradient(to right, #000 0%, #100 75%, rgba(0,0,0,0) 100%)"
  }
});
