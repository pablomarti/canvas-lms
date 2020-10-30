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

class OutcomeAverageCell extends React.Component {
  static defaultProps = {
    scores: [],
    onClick: () => {},
    size: ''
  }

  render() {
    return (
      <Flex.Item size={this.props.size}>
        <div className="cell header-cell" onClick={this.props.onClick}>
          <div className="box" style={{width: '25px', background: 'blue'}}>
            {' '}
          </div>
        </div>
      </Flex.Item>
    )
  }
}

export default OutcomeAverageCell
