import * as React from "react";
import {RouterState} from "./RouterState";
import {css, StyleSheet} from "aphrodite";

export class DevTools extends React.Component<{router: RouterState}> {
  render () {
    const router = this.props.router;
    const links = [];
    for (const location of router.routes.keys()) {
      links.push(
        <li key={location}
            onClick={() => router.gotoLocation(location)}
            className={css(styles.link)}>
          {location}
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
