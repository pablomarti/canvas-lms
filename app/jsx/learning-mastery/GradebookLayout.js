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
import I18n from 'i18n!GradebookGrid'
import React from 'react'
import * as apiClient from './apiClient'
import LearningMasteryGradebook from './LearningMasteryGradebook'
import Paginator from '../shared/components/Paginator'
import ProficiencyFilter from './ProficiencyFilter'
import Rollups from './Rollups'

class GradebookLayout extends React.Component {
  constructor(props) {
    super(props)

    const ratings = [
      ...ENV.GRADEBOOK_OPTIONS.outcome_proficiency.ratings,
      {points: null, mastery: false, description: 'Not Assessed'}
    ].map((r, i) => ({...r, checked: true, onClick: () => this.changeFilter(i)}))

    this.state = {
      loadedOutcomes: false, // TODO: render loader when no outcomes
      page: 0,
      pageCount: 10,
      sortAsc: true,
      sortField: '',
      ratings
    }
  }

  async componentDidMount() {
    this.loadPage(1)
  }

  loadPage = (pageNum = 1, sortField = null, sortAsc = null) => {
    apiClient
      .loadRollups(pageNum, sortField, sortAsc)
      .then(([outcomes, students, submissions, paths, page, page_count, rollups]) => {
        this.setState({
          loadedOutcomes: true,
          rollups: Rollups(rollups, students, outcomes),
          outcomes,
          students,
          submissions,
          paths,
          page,
          pageCount: page_count
        })
      })
  }

  handleSetSortOrder = (sortField, sortAsc) => {
    this.setState(
      {
        loadedOutcomes: false,
        sortField,
        sortAsc
      },
      () => {
        this.loadPage(1, sortField, sortAsc)
      }
    )
  }

  changeFilter(i) {
    const outcomes = this.state.outcomes
    const ratings = [...this.state.ratings]
    const rollups = [...this.state.rollups]

    ratings[i].checked = !ratings[i].checked

    rollups.forEach(r => {
      outcomes.forEach(o => {
        if (r['outcome_' + o.id].rating.points === ratings[i].points) {
          r['outcome_' + o.id].checked = ratings[i].checked
        }
      })
    })

    this.setState({
      ratings,
      rollups
    })
  }

  changeFilter(i) {
    const outcomes = this.state.outcomes
    const ratings = [...this.state.ratings]
    const rollups = [...this.state.rollups]

    ratings[i].checked = !ratings[i].checked

    rollups.forEach(r => {
      outcomes.forEach(o => {
        if (r['outcome_' + o.id].rating.points === ratings[i].points) {
          r['outcome_' + o.id].checked = ratings[i].checked
        }
      })
    })

    this.setState({
      ratings,
      rollups
    })
  }

  render() {
    const {
      loadedOutcomes,
      students,
      outcomes,
      submissions,
      page,
      pageCount,
      sortField,
      sortAsc,
      rollups
    } = this.state
    if (!loadedOutcomes) {
      return ''
    }

    return (
      <div>
        <ProficiencyFilter ratings={this.state.ratings} />
        <LearningMasteryGradebook
          students={students}
          outcomes={outcomes}
          submissions={submissions}
          setSortOrder={this.handleSetSortOrder}
          sortField={sortField}
          sortAsc={sortAsc}
          rollups={rollups}
        />
        <Paginator
          loadPage={this.loadPage}
          page={page}
          pageCount={pageCount}
          margin="small 0 0 0"
        />
      </div>
    )
  }
}

export default GradebookLayout
