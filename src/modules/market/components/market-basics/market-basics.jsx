/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';

// import MarketProperties from 'modules/market/components/market-properties';

// import makePath from 'modules/app/helpers/make-path';
// import makeQuery from 'modules/app/helpers/make-query';

// import { MARKET } from 'modules/app/constants/views';
// import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

import Styles from 'modules/market/components/market-basics/market-basics.styles';
import FontAwesome from 'assets/styles/font-awesome'

const MarketBasics = p => (
  <article className={Styles.MarketBasics}>
    <div className={Styles.MarketBasics__content}>
      <div className={Styles.MarketBasics__header}>
        <ul className={Styles.MarketBasics__tags}>
          <li>Tags</li>
          {(p.tags || []).map((tag, i) => (
            <li key={i}>
              {tag.name ? tag.name : tag}
            </li>
          ))}
        </ul>

        <span>{/* p.isOpen ? (p.isResported ? 'reported' : 'open') : 'closed' */}</span>
      </div>

      <h1>{ p.description }</h1>
    </div>

    <div className={Styles.MarketBasics__footer}>
      <ul className={Styles.MarketBasics__meta}>
        <li>
          <span>Volume</span>
          <span>{ p.volume.rounded }{ p.volume.denomination }</span>
        </li>
        <li>
          <span>Fee</span>
          <span>{ p.takerFeePercent.full }</span>
        </li>
        <li>
          <span>Expires</span>
          <span>{ p.endDate.formatted }</span>
        </li>
      </ul>
      <div>
        { p.isLogged && p.toggleFavorite && 
          <span className={Styles.MarketBasics__favorite}>
            <i 
              className={classNames(FontAwesome.fa, p.isFavorite ? FontAwesome['fa-star'] : FontAwesome['fa-star-o'])}
              onClick={() => p.toggleFavorite(p.id) }
            ></i>
          </span>
        }
        <button className={Styles['button--purple']}>Trade</button>
      </div>
    </div>

    <div className="market-basics-header-actions">
      {p.isLogged && p.toggleFavorite &&
        <button
          className={classNames('button unstyled favorite-button', { on: p.isFavorite })}
          onClick={() => p.toggleFavorite(p.id)}
        >
          <i
            className={classNames('fa', {
              'fa-star': p.isFavorite,
              'fa-star-o': !p.isFavorite
            })}
          />
        </button>
      }
    </div>

    {/*
    {p.id && p.formattedDescription ?
      <Link
        to={{
          pathname: makePath(MARKET),
          search: makeQuery({
            [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
            [MARKET_ID_PARAM_NAME]: p.id
          })
        }}
        className="market-description"
      >
        {p.description}
      </Link> :
      <span className="market-description">{p.description}</span>
    }

    <MarketProperties {...p} /> */}
  </article>
);

MarketBasics.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func
};

export default MarketBasics;