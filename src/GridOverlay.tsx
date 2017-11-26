import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {grid} from "./config/Grid";
import {count} from "./lib/Helpers";
import {Column, Row} from "./config/styles";

@observer
export class GridOverlay extends React.Component<{level?: number}> {
  render () {
    const dynamicStyle = gridOverlayLevels[this.props.level];
    if (!dynamicStyle) {
      return null;
    }

    return (
      <div className={css(styles.gridOverlay)} style={dynamicStyle}>
        {count(grid.rows).map((rowNumber) => (
          <Row key={rowNumber} classStyle={styles.row}>
            {count(grid.columns).map((columnNumber) => (
              <Column key={columnNumber} classStyle={styles.cell}/>
            ))}
          </Row>
        ))}
      </div>
    );
  }
}

export const gridOverlayLevels = [
  undefined,
  {opacity: 0.2},
  {opacity: 0.6}
];

const styles = StyleSheet.create({
  gridOverlay: {
    width: grid.width,
    height: grid.height,
    position: "absolute",
    top: 0, left: 0,
    zIndex: 2,
    pointerEvents: "none"
  },

  row: {
    ":not(:last-child)": {
      marginBottom: grid.gutterHeight
    }
  },

  cell: {
    width: grid.xSpan(1),
    height: grid.ySpan(1),
    background: "green",
    ":not(:last-child)": {
      marginRight: grid.gutterWidth
    }
  }
});
