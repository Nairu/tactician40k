// @flow
import React, { Component } from 'react';
import type { Costs, Force } from '../Types';

type Props = {
  forces: Force[],
  costs: Costs,
  rosterName: string
};

class SidebarView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showConfig: false,
      showReference: false
    }
  }

  handleShowConfig = () => {
    this.setState({
      showConfig: !this.state.showConfig
    });
  }
  handleShowReference = () => {
    this.setState({
      showReference: !this.state.showReference
    });
  }

  render() {
    const menuItems = [];

    let gameType;
    let totalCommandCost;
    let battleSize;

    const groupings = {
      "HQ": [],
      "Troops": [],
      "Elites": [],
      "Fast Attack": [],
      "Heavy Support": [],
      "Flyer": [],
      "Dedicated Transport": [],
      "Lord of War": [],
      "Configuration": [],
      "Reference": [],
      "Ignore": []
    }

    this.props.forces.forEach(force => {
      menuItems.push(<li className="sidebar--menu-section" key={force.id}>
        {force.name} ({force.catalogueName})
      </li>);

      force.selections.forEach(selection => {
        let grouping = selection.categories.at(-1).name;
        console.log(grouping);

        if (grouping === 'Configuration') {
          if (selection.name.toLowerCase() === "gametype") {
            gameType = selection.selections[0].name;
            grouping = "Ignore";
          }
          if (selection.name.toLowerCase() === "battle size") {
            const battleSizeStr = selection.selections[0].name
            battleSize = battleSizeStr.substring(3, battleSizeStr.indexOf('('));
            grouping = "Ignore";
          }
          if (selection.name.toLowerCase() === "detachment command cost") {
            grouping = "Ignore";
          }
        }

        if (selection.name.startsWith("[Reference]")) {
          grouping = "Reference";
        }

        const val = <li key={selection.id}>
          <a href={'#datacard-' + selection.id}>{selection.name}</a>
        </li>;
        groupings[grouping].push(val);
      });

      for (const [key, value] of Object.entries(groupings)) {
        if (value.length > 0) {
          if (key === "Configuration" && this.state.showConfig === false)
            continue;

          if (key === "Reference" && this.state.showReference === false)
            continue;

          if (key == "Ignore")
            continue;
          
          menuItems.push(<li style={{textAlign: "center"}} key={key}>
            --- {key.toUpperCase()} ---
          </li>);
          menuItems.push(...value);
        }
      }
    });

    return (
      <div className="roster--sidebar">
        <div className="logo">
          <i className="fas fa-dice-d6"></i>
          Tactician
        </div>

        <a className="sidebar--back-button" href="/"><i className="fas fa-chevron-left"></i> Back</a>

        <div className="sidebar--title">{this.props.rosterName}</div>
        <div className="sidebar--subtitle">Game Type: {gameType}</div>
        <div className="sidebar--subtitle">Battle Size: {battleSize}</div>
        <div style={{marginBottom: '20px'}} className="sidebar--subtitle">Points/PL Cost: {this.props.costs.points} points - {this.props.costs.powerLevel} PL</div>
        
        <div>
          Show Config Block?
          <label style={{marginLeft: "10px"}} className="switch">
            <input type="checkbox" onClick={this.handleShowConfig}/>
            <span className="slider"></span>
          </label>
        </div>

        <div>
          Show Reference Block?
          <label style={{marginLeft: "10px"}} className="switch">
            <input type="checkbox" onClick={this.handleShowReference}/>
            <span className="slider"></span>
          </label>
        </div>

        <ul className="sidebar--menu">{menuItems}</ul>
      </div>
    );
  }
}

export default SidebarView;