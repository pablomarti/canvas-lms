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
import ProficiencyFilter from './ProficiencyFilter'

class GradebookLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadedOutcomes: false, // TODO: render loader when no outcomes
      ratings: ENV.GRADEBOOK_OPTIONS.outcome_proficiency.ratings
    }
  }

  async componentDidMount() {
    apiClient.loadRollups().then(([outcomes, students, paths]) => {
      this.setState({
        loadedOutcomes: true,
        outcomes,
        students,
        paths
      })
    })
  }

  render() {
    return (
      <div>
        <ProficiencyFilter ratings={this.state.ratings} />
      </div>
    )
  }
}

export default GradebookLayout
