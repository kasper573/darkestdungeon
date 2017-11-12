import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export class BuildingOverview extends React.Component<{
  header: string,
  backgroundUrl: string,
}> {
  render () {
    return (
      <div
        className={css(styles.container)}
        style={{backgroundImage: `url(${this.props.backgroundUrl})`}}>
        <div>
          {this.props.header}
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    minWidth: 350,
    minHeight: 200,
    padding: 10
  }
});
