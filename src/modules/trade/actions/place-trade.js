import { augur } from 'services/augurjs'
import { BUY, SELL } from 'modules/transactions/constants/types'
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress'
import logError from 'utils/log-error'
import calcOrderProfitLossPercents from 'modules/trade/helpers/calc-order-profit-loss-percents'

export const placeTrade = (marketID, outcomeID, tradeInProgress, doNotCreateOrders, callback = logError, onComplete = logError) => (dispatch, getState) => {
  if (!marketID) return null
  const { loginAccount, marketsData } = getState()
  const market = marketsData[marketID]
  if (!tradeInProgress || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for market ${marketID} outcome ${outcomeID}`)
    return dispatch(clearTradeInProgress(marketID))
  }
  const marketOrderPrice = tradeInProgress.side === BUY ? market.maxPrice : market.minPrice
  augur.trading.placeTrade({
    meta: loginAccount.meta,
    amount: tradeInProgress.numShares,
    limitPrice: tradeInProgress.limitPrice ? tradeInProgress.limitPrice : marketOrderPrice,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    tickSize: market.tickSize,
    numTicks: market.numTicks,
    _direction: tradeInProgress.side === BUY ? 0 : 1,
    _market: marketID,
    _outcome: parseInt(outcomeID, 10),
    _tradeGroupId: tradeInProgress.tradeGroupID,
    doNotCreateOrders,
    onSent: () => callback(null, tradeInProgress.tradeGroupID),
    onFailed: callback,
    onSuccess: (tradeOnChainAmountRemaining) => {
      onComplete(tradeOnChainAmountRemaining)
    }
  })
  dispatch(clearTradeInProgress(marketID))
}
