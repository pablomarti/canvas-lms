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
    this.header = React.createRef()
    this.scores = React.createRef()
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
      <Flex direction="row" withVisualDebug padding="0 0 large 0" width="600px">
        <div id="stuck-header">
          {outcomes.map(outcome => {
            return (
              <Flex.Item size="200px" shouldGrow padding="small large small large">
                {this.renderOutcomeHeader(outcome)}
              </Flex.Item>
            )
          })}
        </div>
      </Flex>
    )
  }

  renderScore = () => {
    return <div className="score">5/3</div>
  }

  renderStudentScores = () => {
    const {outcomes} = this.props
    const scores = outcomes.map(outcome => {
      return (
        <Flex.Item size="200px">
          <div className="cell">{this.renderScore()}</div>
        </Flex.Item>
      )
    })
    return <Flex direction="row">{scores}</Flex>
  }

  renderScores = () => {
    const {students, outcomes} = this.props
    const scores = students.map(student => {
      return this.renderStudentScores()
    })
    return (
      <Flex direction="column" withVisualDebug>
        {scores}
      </Flex>
    )
  }

  renderStudent = () => {
    const {students, outcomes} = this.props
    return students.map(student => {
      return (
        <div className="cell">
          <div className="name">{student.name}</div>
        </div>
      )
    })
  }

  handleScrollCells = e => {
    $('#stuck-header')[0].scrollLeft = e.target.scrollLeft
    $('#user-list')[0].scrollTop = e.target.scrollTop
  }

  handleOutcomeScroll = e => {
    $('#scores')[0].scrollLeft = e.target.scrollLeft
  }

  handleStudentScroll = e => {
    $('#scores')[0].scrollTop = e.target.scrollTop
  }

  renderGradebook = () => {
    const {outcomes, students} = this.props
    return (
      <>
        <div className="header">
          <Flex height="50px" direction="column">
            <Flex.Item
              as="header"
              refs={this.header}
              id="outcome-header"
              size="35px"
              overflowX="hidden"
              overflowY="hidden"
              onScroll={this.handleOutcomeScroll}
            >
              {this.renderOutcomeRow()}
            </Flex.Item>
          </Flex>
        </div>
        <div className="wrapper">
          <div className="nav" id="user-list" onScroll={this.handleStudentScroll}>
            {this.renderStudent()}
          </div>
          <div className="mainWrapper" id="scores" onScroll={this.handleScrollCells}>
            {this.renderScores()}
          </div>
        </div>
      </>
    )
  }

  renderHeaderRow = () => {
    return (
      <Flex height="90%" width="100%" direction="column" withVisualDebug>
        <Flex.Item shouldGrow padding="medium">
          {I18n.t('Students')}
        </Flex.Item>
      </Flex>
    )
  }

  render() {
    return <div>{this.renderGradebook()}</div>
  }
}

export default LearningMasteryGradebook
