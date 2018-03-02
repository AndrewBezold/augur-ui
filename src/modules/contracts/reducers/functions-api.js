import { UPDATE_FUNCTIONS_API, UPDATE_FROM_ADDRESS } from 'modules/contracts/actions/update-contract-api'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (functionsAPI = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_FUNCTIONS_API:
      return action.data.functionsAPI
    case UPDATE_FROM_ADDRESS: {
      const { fromAddress } = action.data
      return Object.keys(functionsAPI).reduce((p, contractName) => {
        p[contractName] = Object.keys(functionsAPI[contractName]).reduce((q, functionName) => {
          q[functionName] = {
            ...functionsAPI[contractName][functionName],
            from: fromAddress,
          }
          return q
        }, {})
        return p
      }, {})
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return functionsAPI
  }
}
