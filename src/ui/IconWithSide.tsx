import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonStyles, Row} from "../config/styles";
import {observer} from "mobx-react";
import {Icon, IconProps} from "./Icon";

@observer
export class IconWithSide extends React.Component<
  IconProps & {
  side?: any,
  iconStyle?: any
}> {
  render () {
    const {side, iconStyle, classStyle, ...rest} = this.props;
    const hasSide = side !== undefined;

    return (
      <Row valign="center" classStyle={classStyle}>
        <Icon classStyle={iconStyle} {...rest}/>
        {hasSide && (
          <div className={css(styles.side, commonStyles.commonName)}>
            {side}
          </div>
        )}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },

  side: {
    marginLeft: grid.gutter / 2,
    justifyContent: "center"
  }
});
