/*
 * Copyright (C) 2020 - present Instructure, Inc.
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

const rollupsUrl = (course, exclude, page, sortField, sortAsc) => {
  const excluding = ''
  const sectionParam = ''
  let sortParams = ''
  let sortOutcomeId = ''
  console.log(sortField)
  if (sortField) {
    if (sortField.startsWith('outcome')) {
      [sortField, sortOutcomeId] = sortField.split('_')
      sortParams = `&sort_by=${sortField}`
      sortParams = `${sortParams}&sort_outcome_id=${sortOutcomeId}`
    } else {
      sortParams = `&sort_by=${sortField}`
    }
    if (!sortAsc) {
      sortParams = `${sortParams}&sort_order=desc`
    }
  }
  return `/api/v1/courses/${course}/outcome_rollups?rating_percents=true&per_page=20&include[]=outcomes&include[]=users&include[]=outcome_paths${excluding}&page=${page}${sortParams}${sectionParam}`
}

export const loadRollups = (page = 1, sortField = '', sortAsc = '') => {
  const exclude = ''
  const course = ENV.context_asset_string.split('_')[1]
  const url = rollupsUrl(course, exclude, page, sortField, sortAsc)
  return axios.get(url).then(({data}) => {
    console.log(data)
    const outcomes = data.linked.outcomes
    const students = data.linked.users
    const outcomePaths = data.linked.outcome_paths
    const {page, page_count} = data.meta.pagination
    return [outcomes, students, outcomePaths, page, page_count]
  })
}
