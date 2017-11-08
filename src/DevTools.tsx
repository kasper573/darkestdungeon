import * as React from "react";
import {RouterState} from "./RouterState";
import {css, StyleSheet} from "aphrodite";

export class DevTools extends React.Component<{router: RouterState}> {
  render () {
    const router = this.props.router;
    const links = [];
    for (const path of router.routes.keys()) {
      links.push(
        <li key={path}
            onClick={() => router.goto(path)}
            className={css(styles.link)}>
          {path}
        </li>
      );
    }

    return (
      <ul className={css(styles.container)}>
        {links}
      </ul>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "1vw",
    left: "1vw",
    flexDirection: "row"
  },

  link: {
    marginRight: "1vw"
  }
});
