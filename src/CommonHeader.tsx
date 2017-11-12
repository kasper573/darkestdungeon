import * as React from "react";

export class CommonHeader extends React.Component<{label: string}> {
  render () {
    return (
      <div style={{whiteSpace: "nowrap"}}>{this.props.label}</div>
    );
  }
}
