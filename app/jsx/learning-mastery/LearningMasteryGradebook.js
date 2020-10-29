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
import OutcomeHeader from './OutcomeHeader'
import StudentCell from './StudentCell'
import OutcomeAverageCell from './OutcomeAverageCell'
import $ from 'jquery'
import {truncate} from 'lodash'
import {getIconClass} from '../outcomes/ColumnTooltip'
import OutcomeColumnView from 'compiled/views/gradebook/OutcomeColumnView'
import OutcomeHeader from './OutcomeHeader'
import $ from 'jquery'

class LearningMasteryGradebook extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    outcomes: [
      {id: 1, title: 'outcome_1', expanded: false},
      {id: 2, title: 'outcome_2', expanded: false},
      {id: 3, title: 'outcome_3', expanded: false},
      {id: 4, title: 'outcome_4', expanded: false},
      {id: 5, title: 'outcome_5', expanded: false},
      {id: 6, title: 'outcome_6', expanded: false},
      {id: 7, title: 'outcome_7', expanded: false},
      {id: 8, title: 'outcome_8', expanded: false},
      {id: 9, title: 'outcome_9', expanded: false},
      {id: 10, title: 'outcome_10', expanded: false}
    ],
    students: [],
    setSortOrder: () => {},
    alignments: [
      {alignment: 'Quiz'},
      {alignment: 'Assignment'}
    ],
    rollups: []
  }

  handleExpandedOutcome = (outcomeId) => {
    const outcomes = [...this.props.outcomes]
    const outcome = outcomes.find(o => o.id == outcomeId)
    outcome.expanded = !outcome.expanded

    this.setState({
      outcome
    })
  }

  outcomeAlignments = outcomeId => {
    return this.props.alignments
  }

  renderOutcomeRow = () => {
    const {outcomes} = this.props
    return (
      <Flex direction="row">
        <div className="sticky-header" id="stuck-header">
          {outcomes.map((outcome, index) => {
            if (outcome.expanded) {
              const alignments = this.outcomeAlignments(outcome.id)
              const size = 200 + (100 * alignments.length);
              return (
                <Flex.Item size={size + 'px'}>
                  <div className="cell header-cell">
                    <OutcomeHeader onExpandOutcome={this.handleExpandedOutcome} outcome={outcome} />
                  </div>
                </Flex.Item>
              )
            } else {
              <Flex.Item size='200px'>
                  <div className="cell header-cell">
                    <OutcomeHeader onExpandOutcome={this.handleExpandedOutcome} outcome={outcome} />
                  </div>
                </Flex.Item>
            }
          })
        }
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
    const scores = outcomes.map((outcome) => {
      return (
        <>
          <Flex.Item size="100px">
            <div className="cell">{this.renderScore()}</div>
          </Flex.Item>
          {this.renderAlignments(student, outcome)}
        </>
      )
    })
    return <Flex direction="row">{scores}</Flex>
  }

  renderAlignments(student, outcome) {
    if (outcome.expanded) {
      return (
        <>
        <Flex.Item size="100px">
          <div className="cell">small</div>
        </Flex.Item>
        <Flex.Item size="100px">
          <div className="cell">small</div>
        </Flex.Item>
        </>
      )
    }

    return (
      <>
      </>
    )
  }

  renderScoresGrid = () => {
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
          <div className="name">
            <StudentCell user={student} courseId={ENV.context_asset_string.split('_')[1]} />
          </div>
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
        <div>
          <div
            style={{
              borderBottom: '1px solid #BDBDBD',
              height: '40px',
              paddingLeft: '135px',
              overflow: 'hidden',
              maxWidth: '600px'
            }}
            onScroll={this.handleOutcomeScroll}
          >
            {this.renderOutcomeRow()}
          </div>
          <div
            style={{
              height: '40px',
              overflow: 'hidden',
              borderBottom: '1px solid #BDBDBD',
              maxWidth: '735px'
            }}
          >
            {this.renderHeaderRow()}
          </div>
        </div>

        <div className="wrapper">
          <div className="nav" id="user-list" onScroll={this.handleStudentScroll}>
            {this.renderStudent()}
          </div>
          <div className="mainWrapper" id="scores" onScroll={this.handleScrollCells}>
            {this.renderScoresGrid()}
          </div>
        </div>
      </>
    )
  }

  renderHeaderRow = () => {
    const {outcomes} = this.props
    return (
      <>
        <div style={{height: '40px', width: '135px', float: 'left'}}>
          <div className="cell header-cell">
            <div className="outcome-column-header">Students</div>
          </div>
        </div>
        <Flex direction="row">
          <div className="sticky-header" id="averages-row" onScroll={this.handleAverageScroll}>
            {outcomes.map(outcome => (
              <OutcomeAverageCell
                scores={[]}
                onClick={() => this.toggleSort(`outcome_${outcome.id}`)}
              />
            ))}
          </div>
        </Flex>
      </>
    )
  }

  render() {
    return <div>{this.renderGradebook()}</div>
  }
}

export default LearningMasteryGradebook
