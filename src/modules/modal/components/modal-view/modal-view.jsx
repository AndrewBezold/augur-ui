import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'
import ModalUport from 'modules/modal/components/modal-uport/modal-uport'
import ModalFundsWarning from 'modules/modal/components/modal-funds-warning/modal-funds-warning'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import { MODAL_LEDGER, MODAL_UPORT, MODAL_FUNDS_WARNING } from 'modules/modal/constants/modal-types'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    network: PropTypes.number.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      modalWidth: 0,
      modalHeight: 0
    }

    this.updateModalDimensions = this.updateModalDimensions.bind(this)
    this.debounceUpdateModalDimensions = debounce(this.updateModalDimensions.bind(this))
  }

  componentDidMount() {
    this.updateModalDimensions()

    window.addEventListener('resize', this.debouncedSetQRSize)
  }

  updateModalDimensions() {
    this.setState({
      modalWidth: getValue(this, 'modal.clientWidth') || 0,
      modalHeight: getValue(this, 'modal.clientHeight') || 0
    })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section
        ref={(modal) => { this.modal = modal }}
        className={Styles.ModalView}
      >
        <div
          className={Styles.ModalView__content}
        >
          {p.modal.type === MODAL_FUNDS_WARNING &&
            <ModalFundsWarning
              {...p.modal}
              network={p.network}
            />
          }
          {p.modal.type === MODAL_LEDGER &&
            <ModalLedger {...p.modal} />
          }
          {p.modal.type === MODAL_UPORT &&
            <ModalUport
              {...p.modal}
              modalWidth={s.modalWidth}
              modalHeight={s.modalHeight}
            />
          }
          {p.modal.canClose &&
            <button
              className={Styles.ModalView__button}
              onClick={p.closeModal}
            >
              Close
            </button>
          }
        </div>
      </section>
    )
  }
}
