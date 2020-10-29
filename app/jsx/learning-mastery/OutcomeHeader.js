/*
 * Copyright (C) 2014 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import axios from 'axios'
import I18n from 'i18n!GradebookGrid'
import React from 'react'
import {Flex} from '@instructure/ui-flex'
import OutcomeColumnView from 'compiled/views/gradebook/OutcomeColumnView'
import $ from 'jquery'

class OutcomeHeader extends React.Component {
  constructor(props) {
    super(props)
    this.outcomeRef = React.createRef()
    this.view = null
  }

  static defaultProps = {
    outcome: {}
  }

  // componentDidMount() {
  //   const {outcome} = this.props
  //   this.view = new OutcomeColumnView({
  //     el: this.outcomeRef.current,
  //     attributes: outcome,
  //     totalsFn: () => {}
  //   })
  //   this.view.render()
  // }

  // componentWillUnmount() {
  //   this.view.remove()
  // }

  render() {
    const {outcome, onExpandOutcome} = this.props

    return (
      <>
        <div className="outcome-column-header" ref={this.outcomeRef}>
          {outcome.title}
        </div>
        <div className="outcome-header-arrow" onClick={() => onExpandOutcome(outcome.id)}>
          {outcome.expanded ? '<-' : '->'}
        </div>
        {/* TODO: make this an IconButton from instui */}
      </>
    )
  }
}

export default OutcomeHeader
