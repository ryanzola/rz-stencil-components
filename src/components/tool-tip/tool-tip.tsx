import { Component, State, Prop } from '@stencil/core';

@Component({
  tag: 'rz-tooltip',
  styleUrl: 'tooltip.scss',
  shadow: true
})
export class Tooltip {
  @State() tooltipVisible = false;

  @Prop() text: string;

  onToggleTooltip() {
    this.tooltipVisible = !this.tooltipVisible;
  }

  render() {
    let tooltip = null;
    if(this.tooltipVisible) {
      tooltip = <div id="tooltip-text">{this.text}</div>
    }
    return [
      <slot />,
      <span id="tooltip-icon" onClick={this.onToggleTooltip.bind(this)}>?</span>,
      tooltip
    ]
  }
}