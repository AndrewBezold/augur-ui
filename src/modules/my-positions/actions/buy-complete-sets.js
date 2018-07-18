import { augur } from 'services/augurjs'
import { createBigNumber } from 'utils/create-big-number'
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export function buyCompleteSets(marketId, numCompleteSets, callback = logError) {
  return (dispatch, getState) => {
    const {
      loginAccount,
      marketsData,
    } = getState()
    if (!loginAccount.address) return callback(null)
    const {
      numTicks,
      maxPrice,
      minPrice,
    } = marketsData[marketId]
    const numCompleteSetsOnChain = augur.utils.convertDisplayAmountToOnChainAmount(createBigNumber(numCompleteSets.fullPrecision), createBigNumber(maxPrice - minPrice), numTicks)
    const buyCompleteSetsParams = {
      tx: {},
      meta: loginAccount.meta,
      _market: marketId,
      _amount: numCompleteSetsOnChain,
      onSent: noop,
      onSuccess: (res) => {
        dispatch(loadAccountTrades({ marketId }))
      },
      onFailed: err => callback(err),
    }
    augur.api.CompleteSets.publicBuyCompleteSets(buyCompleteSetsParams)
  }
}
