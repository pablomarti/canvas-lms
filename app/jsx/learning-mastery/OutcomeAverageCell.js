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

import React from 'react'
import {Flex} from '@instructure/ui-flex'
import {IconArrowDownSolid, IconArrowUpSolid} from '@instructure/ui-icons'

class OutcomeAverageCell extends React.Component {
  static defaultProps = {
    scores: [],
    onClick: () => {},
    size: '',
    outcome: {},
    isReversed: false
  }

  renderBox = (width, color) => {
    return <div className="box" style={{width, background: `#${color}`, marginRight: '2px'}} />
  }

  renderBoxes = () => {
    const {outcome, isReversed} = this.props
    const ratings = outcome?.ratings || []
    return (isReversed ? [...ratings].reverse() : ratings).map(rating => {
      if (rating?.percent?.length > 0 && rating.percent[0] > 0) {
        const width = (rating.percent[0] / 100.0) * 250
        return this.renderBox(width, rating.color)
      }
    })
  }

  render() {
    return (
      <Flex.Item size={this.props.size}>
        <div className="cell average-cell" onClick={this.props.onClick}>
          {this.renderBoxes()}
          <div style={{marginTop: '-4px', textAlign: 'center'}}>
            {this.props.isReversed ? <IconArrowDownSolid /> : <IconArrowUpSolid />}
          </div>
        </div>
      </Flex.Item>
    )
  }
}

export default OutcomeAverageCell
