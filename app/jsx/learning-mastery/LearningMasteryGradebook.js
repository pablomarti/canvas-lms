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
import I18n from 'i18n!learningMasteryGradebook'

import React from 'react'
import {Flex} from '@instructure/ui-flex'
import OutcomeHeader from './OutcomeHeader'
import StudentCell from './StudentCell'
import OutcomeAverageCell from './OutcomeAverageCell'
import $ from 'jquery'
import {getIconClass} from '../outcomes/ColumnTooltip'

class LearningMasteryGradebook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedOutcomes: {}
    }
  }

  static defaultProps = {
    outcomes: [
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'},
      {title: 'wow'}
    ],
    students: [],
    alignments: [],
    rollups: [],
    setSortOrder: () => {}
  }

  handleExpandedOutcome = outcomeId => {
    const {expandedOutcomes} = this.state

    this.setState({
      expandedOutcomes: {...expandedOutcomes, [outcomeId]: !expandedOutcomes[outcomeId]}
    })
  }

  outcomeAlignments = outcome => {
    return outcome?.alignments?.filter(o => o.indexOf('rubric_') === -1) || []
  }

  toggleSort = newSortField => {
    const {sortField, sortAsc, setSortOrder} = this.props
    sortField === newSortField
      ? setSortOrder(sortField, !sortAsc)
      : setSortOrder(newSortField, true)
  }

  renderOutcomeRow = () => {
    const {outcomes} = this.props
    const {expandedOutcomes} = this.state

    return (
      <Flex direction="row">
        <div className="sticky-header" id="stuck-header">
          {outcomes.map(outcome => {
            const isExpanded = expandedOutcomes[outcome.id]
            return (
              <Flex.Item size={this.outcomeCellWidth(outcome)}>
                <div className="cell header-cell">
                  <OutcomeHeader
                    onExpandOutcome={this.handleExpandedOutcome}
                    isExpanded={isExpanded}
                    outcome={outcome}
                  />
                </div>
              </Flex.Item>
            )
          })}
        </div>
      </Flex>
    )
  }

  loadRollup = student => {
    const rollups = this.props.rollups
    const rollup = rollups.find(r => r.student === student)
    return rollup
  }

  renderScore = (student, outcome) => {
    const rollup = this.loadRollup(student, outcome)
    const outcome_rollup = rollup['outcome_' + outcome.id]

    let icon
    icon = outcome_rollup
      ? getIconClass(outcome_rollup?.rating?.points, outcome.mastery_points)
      : getIconClass(undefined)

    return (
      <div className="score">
        <div
          className="outcome-proficiency-dot"
          style={{
            backgroundColor: outcome_rollup ? '#' + outcome_rollup?.rating.color : '#FFFFFF',
            opacity: outcome_rollup?.checked ? 1 : 0.3
          }}
        >
          <div className={icon} />
        </div>
      </div>
    )
  }

  renderStudentScores = student => {
    const {outcomes} = this.props
    const {expandedOutcomes} = this.state
    const scores = outcomes.map(outcome => {
      const isExpanded = expandedOutcomes[outcome.id]
      return (
        <>
          <Flex.Item size={isExpanded ? '200px' : '300px'}>
            <div className="cell">{this.renderScore(student, outcome)}</div>
          </Flex.Item>
          {isExpanded ? this.renderAlignments(student, outcome) : null}
        </>
      )
    })
    return <Flex direction="row">{scores}</Flex>
  }

  renderAlignments(student, outcome) {
    const rollup = this.loadRollup(student)

    return this.outcomeAlignments(outcome).map(a => {
      const outcomes_result =
        rollup?.student_outcomes_results?.find(r => r.assignment_id === a) || null
      const outcome_rollup = rollup['outcome_' + outcome.id]
      const score = outcomes_result?.score || 0

      let icon
      icon = outcome_rollup ? getIconClass(score, outcome.mastery_points) : getIconClass(undefined)

      return (
        <Flex.Item size="100px">
          <div className="cell">
            <div
              className="outcome-proficiency-dot"
              style={{
                backgroundColor: outcomes_result?.rating?.color
                  ? `#${outcomes_result?.rating.color}`
                  : `#FFFFFF`,
                opacity: outcome_rollup?.checked ? 1 : 0.3
              }}
            >
              <div className={icon} />
            </div>
          </div>
        </Flex.Item>
      )
    })
  }

  renderScoresGrid = () => {
    const {students} = this.props
    const scores = students.map(student => {
      return this.renderStudentScores(student)
    })
    return <Flex direction="column">{scores}</Flex>
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

  outcomeCellWidth = outcome => {
    const {expandedOutcomes} = this.state
    if (!expandedOutcomes[outcome.id]) {
      return '300px'
    }

    const alignments = this.outcomeAlignments(outcome)
    const size = 200 + 100 * alignments.length
    return size + 'px'
  }

  renderGradebook = () => {
    return (
      <>
        <div>
          <div
            style={{
              borderBottom: '1px solid #BDBDBD',
              height: '40px',
              paddingLeft: '134px',
              overflow: 'hidden',
              maxWidth: '880px',
              borderRight: '1px solid #BDBDBD',
              width: this.props.outcomes.length * 300
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
              maxWidth: '1015px', // 880 + 135
              width: this.props.outcomes.length * 300 + 135
            }}
          >
            {this.renderHeaderRow()}
          </div>
        </div>

        <div className="wrapper">
          <div className="nav" id="user-list" onScroll={this.handleStudentScroll}>
            {this.renderStudent()}
          </div>
          <div
            className="mainWrapper"
            style={{width: this.props.outcomes.length * 300, maxWidth: '880px', maxHeight: '660px'}}
            id="scores"
            onScroll={this.handleScrollCells}
          >
            {this.renderScoresGrid()}
          </div>
        </div>
      </>
    )
  }

  renderHeaderRow = () => {
    const {outcomes, sortAsc, sortField} = this.props
    return (
      <>
        <div style={{height: '40px', width: '135px', float: 'left'}}>
          <div className="cell header-cell">
            <div className="name" style={{fontSize: '16px', color: 'black'}}>
              {I18n.t('Students')}
            </div>
          </div>
        </div>
        <Flex direction="row">
          <div className="sticky-header" id="averages-row" onScroll={this.handleAverageScroll}>
            {outcomes.map(outcome => {
              let alignments

              if (this.state.expandedOutcomes[outcome.id]) {
                alignments = this.outcomeAlignments(outcome).map(a => (
                  <Flex.Item size="100px">
                    {this.props.alignments.find(al => al.id == a)?.name}
                  </Flex.Item>
                ))
              }

              return (
                <>
                  <OutcomeAverageCell
                    isExpanded={this.state.expandedOutcomes[outcome.id]}
                    size={this.state.expandedOutcomes[outcome.id] ? '200px' : '300px'}
                    outcome={outcome}
                    scores={[]}
                    isReversed={`outcome_${outcome.id}` === sortField ? sortAsc : false}
                    onClick={() => this.toggleSort(`outcome_${outcome.id}`)}
                  />
                  {alignments}
                </>
              )
            })}
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
