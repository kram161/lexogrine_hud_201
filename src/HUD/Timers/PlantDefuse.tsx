import React from "react";

import { Timer } from "../MatchBar/MatchBar";
import { Player } from "csgogsi";
import * as I from "./../../assets/Icons";

interface IProps {
  timer: Timer | null;
  side: "right" | "left"
}

export default class Bomb extends React.Component<IProps> {
  getCaption = (type: "defusing" | "planting", player: Player | null) => {
    if(!player) return null;
    const { side, timer } = this.props;
    if(type === "defusing"){
      return <>
        <div className={'CT defusing-block'}>
          <I.Defuse height={22} width={22} fill="var(--color-new-ct)" />
          <p>{player.name} is defusing the bomb</p>
          <div className="defuse_plant_bar" style={{ width: `${(timer && timer.width) || 0}%` }}></div>
        </div>
      </>;
    }
    return <>
      <div className={'T planting-block'}>
        <I.SmallBomb height={22} fill="var(--color-new-t)"/>
        {player.name} is planting the bomb
        <div className="defuse_plant_bar" style={{ width: `${(timer && timer.width) || 0}%` }}></div>
      </div>
    </>;
  }
  render() {
    const { side, timer } = this.props;
    return (
      <div className={`defuse_plant_container ${side}  ${timer && timer.active ? 'show' :'hide'}`}>
        {
          timer ?
          <div className={`defuse_plant_caption`}>
            {this.getCaption(timer.type, timer.player)}
          </div> : null
        }

      </div>
    );
  }
}
