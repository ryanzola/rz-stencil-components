import { Component } from "@stencil/core";

@Component({
  tag: 'rz-spinner',
  styleUrl: 'spinner.scss',
  shadow: true
})
export class Spinner {
  render() {
    return <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  }
}