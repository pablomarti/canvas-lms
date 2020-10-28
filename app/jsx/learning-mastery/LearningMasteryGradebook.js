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
import {getIconClass} from '../outcomes/ColumnTooltip'
import OutcomeColumnView from 'compiled/views/gradebook/OutcomeColumnView'
import OutcomeHeader from './OutcomeHeader'
import $ from 'jquery'

class LearningMasteryGradebook extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expandedOutcomes: {}
    }
  }

  static defaultProps = {
    outcomes: [],
    students: [],
    rollups: []
  }

  handleExpandedOutcome = (outcomeId, expanded) => {
    console.log(outcomeId)
    console.log(expanded)
  }

  renderOutcomeRow = () => {
    const {outcomes} = this.props
    return (
      <Flex direction="row" withVisualDebug padding="0 0 large 0" width="600px">
        <div id="stuck-header">
          {outcomes.map((outcome, index) => {
            if (index == 1) {
              // TODO: remove. we need to read the 'expandedOutcomes' from state here
              return (
                <>
                  <Flex.Item size="300px">
                    <div className="cell header-cell">
                      <OutcomeHeader
                        onExpandOutcome={this.handleExpandedOutcome}
                        outcome={outcome}
                      />
                    </div>
                  </Flex.Item>
                </>
              )
            } else {
              return (
                <Flex.Item size="200px">
                  <div className="cell header-cell">
                    <OutcomeHeader onExpandOutcome={this.handleExpandedOutcome} outcome={outcome} />
                  </div>
                </Flex.Item>
              )
            }
          })}
        </div>
      </Flex>
    )
  }

  renderScore = (student, outcome) => {
    const rollups = this.props.rollups
    const rollup = rollups.find(r => r.student === student)
    const outcome_rollup = rollup['outcome_' + outcome.id]
    const icon = getIconClass(outcome_rollup.rating.points, outcome.mastery_points)

    return (
      <div
        className="outcome-proficiency-dot"
        style={{
          backgroundColor: '#' + outcome_rollup.rating.color,
          opacity: outcome_rollup.checked ? 1 : 0.3
        }}
      >
        <div className={icon} />
      </div>
    )
  }

  renderStudentScores = student => {
    const {outcomes} = this.props
    const scores = outcomes.map((outcome, index) => {
      if (index == 1) {
        return (
          <>
            <Flex.Item size="100px">
              <div className="cell">{this.renderScore()}</div>
            </Flex.Item>
            <Flex.Item size="100px">
              <div className="cell">small</div>
            </Flex.Item>
            <Flex.Item size="100px">
              <div className="cell">small</div>
            </Flex.Item>
          </>
        )
      } else {
        return (
          <Flex.Item size="200px">
            <div className="cell">{this.renderScore()}</div>
          </Flex.Item>
        )
      }
    })
    return <Flex direction="row">{scores}</Flex>
  }

  renderScores = () => {
    const {students} = this.props
    const scores = students.map(student => {
      return this.renderStudentScores(student)
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
    $('#averages-row')[0].scrollLeft = e.target.scrollLeft

    $('#user-list')[0].scrollTop = e.target.scrollTop
  }

  handleOutcomeScroll = e => {
    $('#scores')[0].scrollLeft = e.target.scrollLeft
    $('#averages-row')[0].scrollLeft = e.target.scrollLeft
  }

  handleAverageScroll = e => {
    $('#scores')[0].scrollLeft = e.target.scrollLeft
    $('#stuck-header')[0].scrollLeft = e.target.scrollLeft
  }

  handleStudentScroll = e => {
    $('#scores')[0].scrollTop = e.target.scrollTop
  }

  renderGradebook = () => {
    return (
      <>
        <div className="table-header-row">
          <Flex height="40px" direction="column">
            <Flex.Item
              as="header"
              size="40px"
              overflowX="hidden"
              overflowY="hidden"
              onScroll={this.handleOutcomeScroll}
            >
              {this.renderOutcomeRow()}
            </Flex.Item>
          </Flex>
          <div style={{height: '40px', width: '600px', overflow: 'hidden'}}>
            {this.renderHeaderRow()}
          </div>
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
    const {outcomes, students} = this.props

    return (
      <Flex direction="row" withVisualDebug width="600px">
        <div className="sticky-header" id="averages-row" onScroll={this.handleAverageScroll}>
          {outcomes.map(outcome => {
            return (
              <Flex.Item size="200px">
                <div className="cell header-cell">
                  <div className="outcome-column-header">{outcome}</div>{' '}
                  {/* TODO: Replace with averages */}
                </div>
              </Flex.Item>
            )
          })}
        </div>
      </Flex>
    )
  }

  render() {
    return <div>{this.renderGradebook()}</div>
  }
}

export default LearningMasteryGradebook
