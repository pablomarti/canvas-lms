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
import * as apiClient from './apiClient'
import LearningMasteryGradebook from './LearningMasteryGradebook'
import Paginator from '../shared/components/Paginator'
import ProficiencyFilter from './ProficiencyFilter'

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
      ratings: ratings
    }
  }

  async componentDidMount() {
    this.loadPage(1)
  }

  loadPage = (pageNum = 1, sortField = null, sortAsc = null) => {
    apiClient
      .loadRollups(pageNum, sortField, sortAsc)
      .then(([outcomes, students, paths, page, page_count]) => {
        this.setState({
          loadedOutcomes: true,
          outcomes,
          students,
          paths,
          page,
          pageCount: page_count
        })
      })
  }

  handleSetSortOrder = (sortField, sortAsc) => {
    console.log(sortField)
    console.log(sortAsc)
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
    const tmpRatings = this.state.ratings;
    tmpRatings[i].checked = !tmpRatings[i].checked
    this.setState({
      ratings: tmpRatings
    })
  }

  changeFilter(i) {
    const tmpRatings = this.state.ratings
    tmpRatings[i].checked = !tmpRatings[i].checked
    this.setState({
      ratings: tmpRatings
    })
  }

  render() {
    const {loadedOutcomes, students, outcomes, page, pageCount, sortField, sortAsc} = this.state
    if (!loadedOutcomes) {
      return ''
    }

    return (
      <div>
        <ProficiencyFilter ratings={this.state.ratings} />
        <LearningMasteryGradebook
          students={students}
          outcomes={outcomes}
          setSortOrder={this.handleSetSortOrder}
          sortField={sortField}
          sortAsc={sortAsc}
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
