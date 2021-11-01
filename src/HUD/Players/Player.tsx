import React from "react";
import { Player, WeaponRaw } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import {apiUrl} from "../../api/api";
import {getCountry} from "../countries";



interface IProps {
  player: Player,
  isObserved: boolean,
  isFreezetime: boolean,
}


export default class PlayerBox extends React.Component<IProps> {
  render() {
    const { player } = this.props;
    const weapons: WeaponRaw[] = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
    const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter(weapon => weapon.type === "Grenade");
    const isLeft = player.team.orientation === "left";
    const country = player.country || player.team.country;
    const countryName = country ? getCountry(country) : null;


    return (
      <div className={`player ${player.state.health === 0 ? "dead" : ""} ${this.props.isObserved ? 'active' : ''}`}>
        <div className="player_data">
          <div className="player_data_inf">
            <div className="player_data_first_block">
              <div className="player_data_first_block_description">
                <Avatar steamid={player.steamid} height={57} width={57} showSkull={false}/>
                <div className="flag">{countryName ? <img src={`${apiUrl}files/img/flags/${countryName.replace(/ /g, "-")}.png`} alt={countryName} /> : ''}</div>
              </div>
              <div className="username">
                <div>{isLeft ? <span>{player.observer_slot}</span> : null} {player.name} {!isLeft ? <span>{player.observer_slot}</span> : null}</div>
              </div>
            </div>
            <div className="player_data_second_block">
              <div className="player_data_second_block_weapon">
                <div className="armor_and_utility">
                  <Bomb player={player} />
                  <Armor player={player} />
                  <Defuse player={player} />
                </div>
              </div>
              <div className="player_data_second_block_weapon_icon">
                {primary || secondary ? <Weapon weapon={primary ? primary.name : secondary.name} active={primary ? primary.state === "active" : secondary.state === "active"} /> : ""}
                <div className="secondary_weapon">{primary && secondary ? <Weapon weapon={secondary.name} active={secondary.state === "active"} /> : ""}</div>
              </div>
              <div className="grenades">
                {grenades.map(grenade => (
                    [
                      <Weapon key={`${grenade.name}-${grenade.state}`} weapon={grenade.name} active={grenade.state === "active"} isGrenade />,
                      grenade.ammo_reserve === 2 ? <Weapon key={`${grenade.name}-${grenade.state}-double`} weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null,
                    ]
                ))}
              </div>
            </div>
            <div className="player_data_third_block">
              <div className="dead-stats">
                <div className="labels">
                  <div className="stat-label">K</div>
                  <div className="stat-label">A</div>
                  <div className="stat-label">D</div>
                </div>
                <div className="values">
                  <div className="stat-value">{player.stats.kills}</div>
                  <div className="stat-value">{player.stats.assists}</div>
                  <div className="stat-value">{player.stats.deaths}</div>
                </div>
              </div>
              <div className="money">${player.state.money}</div>
            </div>
          </div>
          <div className="player_data_stats">
            <div className="currentHealthRed"></div>
            <div id="currentHealth" className={`hp_bar ${player.state.health <= 20 ? 'low':''}`} style={{ width: `${player.state.health}%` }}>
              <div className="health">
              </div>
            </div>
            <div className="healthInfo">
              {player.state.health}
            </div>
            <div className="active_border"></div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    const playerHealth = document.querySelectorAll('.hp_bar');
    for(let i = 0; i < playerHealth.length; i++){
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      };
      const callback = function(mutationsList:any, observer:any) {
        for (let mutation of mutationsList) {
          console.log(mutation);
          const target = mutation.target;
          target.parentNode.querySelector('.currentHealthRed').style.width = target.style.width;
          console.log(target.style.width)
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(playerHealth[i], config);
    }
  }
}
