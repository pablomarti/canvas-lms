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
import _ from 'underscore'
import LearningMasteryGradebook from './LearningMasteryGradebook'
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
      ratings
    }
  }

  async componentDidMount() {
    apiClient.loadRollups().then(([outcomes, students, paths, rollups]) => {
      this.setState({
        loadedOutcomes: true,
        rollups: Rollups(rollups, students),
        outcomes,
        students,
        paths
      })
    })
  }

  changeFilter(i) {
    const tmpRatings = [...this.state.ratings]
    tmpRatings[i].checked = !tmpRatings[i].checked
    this.setState({
      ratings: tmpRatings
    })
  }

  render() {
    const {outcomes, loadedOutcomes, students, rollups} = this.state
    if (!loadedOutcomes) {
      return ''
    }

    return (
      <div>
        <ProficiencyFilter ratings={this.state.ratings} />
        <LearningMasteryGradebook outcomes={outcomes} students={students} rollups={rollups} />
      </div>
    )
  }
}

export default GradebookLayout
