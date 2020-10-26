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

class LearningMasteryGradebook extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    outcomes: [
      'outcome_1',
      'outcome_2',
      'outcome_1',
      'outcome_2',
      'outcome_1',
      'outcome_2',
      'outcome_1',
      'outcome_2',
      'outcome_1',
      'outcome_2'
    ],
    students: []
  }

  renderOutcomeHeader = outcome => {
    return <div style={{textAlign: 'center'}}>{outcome}</div>
  }

  renderOutcomeRow = () => {
    const {outcomes} = this.props
    return (
      <div style={{paddingLeft: '15%'}}>
        <Flex direction="row" withVisualDebug>
          {outcomes.map(outcome => {
            return (
              <Flex.Item size="200px" shouldGrow shouldShrink padding="small">
                {this.renderOutcomeHeader(outcome)}
              </Flex.Item>
            )
          })}
        </Flex>
      </div>
    )
  }

  renderScore = () => {
    return '5/3'
  }

  renderScores = () => {
    const {students, outcomes} = this.props
    return students.map(student => {
      return (
        <Flex direction="row" withVisualDebug>
          <Flex.Item withVisualDebug size="15%">
            {student.name}
          </Flex.Item>
          {outcomes.map(outcome => {
            return (
              <Flex.Item size="200px" shouldGrow shouldShrink padding="small">
                <div style={{textAlign: 'center'}}>{this.renderScore()}</div>
              </Flex.Item>
            )
          })}
        </Flex>
      )
    })
  }

  renderGradebook = () => {
    const {outcomes, students} = this.props
    return (
      <Flex width="90%" direction="row" withVisualDebug>
        <Flex.Item shouldShrink shouldGrow overflowX="auto" padding="medium" withVisualDebug>
          {this.renderOutcomeRow()}
          {this.renderHeaderRow()}
          {this.renderScores()}
        </Flex.Item>
      </Flex>
    )
  }

  renderHeaderRow = () => {
    return (
      <Flex height="90%" width="100%" direction="column" withVisualDebug>
        <Flex.Item shouldGrow padding="medium">
          {I18n.t('Students')}
        </Flex.Item>
        {/* TODO: Render outcome averages */}
      </Flex>
    )
  }

  render() {
    return <div>{this.renderGradebook()}</div>
  }
}

export default LearningMasteryGradebook
