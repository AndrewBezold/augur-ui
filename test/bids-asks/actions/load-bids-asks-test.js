import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import testState from 'test/testState'
import sinon from 'sinon'

const marketsData = { MARKET_0: { numOutcomes: 3 } }

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
  proxyquire.noPreserveCache()

  const mockLoadMarketsInfo = {}


  const test = t => it(t.description, (done) => {
    const state = Object.assign({}, testState)
    const mockStore = configureMockStore([thunk])
    const store = mockStore(state)

    mockLoadMarketsInfo.loadMarketsInfo = sinon.stub().callsFake((p, cb) => (dispatch, getState) => {
      cb(null, t.marketData)
    })

    const loadBidsAsks = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {
      './load-one-outcome-bids-asks': t.stub.loadOneOutcomeBidsAsks,
      '../../markets/actions/load-markets-info': mockLoadMarketsInfo
    }).default

    store.dispatch(loadBidsAsks(t.params.marketID, (err) => {
      t.assertions(err, store.getActions())
      store.clearActions()
      done()
    }))
  })
  test({
    description: 'short-circuit if market ID not provided',
    params: {
      marketID: undefined
    },
    marketData: {
      marketsData
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID: undefined')
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'short-circuit if market data not found',
    params: {
      marketID: 'MARKET_0'
    },
    marketData: {

    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'market MARKET_0 data not found')
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'short-circuit if market numOutcomes not found',
    params: {
      marketID: 'MARKET_0'
    },
    marketData: {
      MARKET_0: { numOutcomes: undefined }
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'market MARKET_0 numOutcomes not found')
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'market with 2 outcomes',
    params: {
      marketID: 'MARKET_0'
    },
    marketData: {
      MARKET_0: { numOutcomes: 2 }
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketID, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketID,
            outcome
          })
          callback(null)
        }
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 0
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 1
      }])
    }
  })
  test({
    description: 'market with 3 outcomes',
    params: {
      marketID: 'MARKET_0'
    },
    marketData: { MARKET_0: { numOutcomes: 3 } },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketID, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketID,
            outcome
          })
          callback(null)
        }
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 0
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 1
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 2
      }])
    }
  })
  test({
    description: 'propagate loadOneOutcomeBidsAsks error',
    params: {
      marketID: 'MARKET_0'
    },
    marketData: { MARKET_0: { numOutcomes: 2 } },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketID, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketID,
            outcome
          })
          callback('ERROR_MESSAGE')
        }
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'ERROR_MESSAGE')
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketID: 'MARKET_0',
        outcome: 0
      }])
    }
  })
})
