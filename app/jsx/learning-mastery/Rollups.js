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

function loadRow(rollups_group, students, outcomes, outcomes_results) {
  const rollup = rollups_group[0]

  const user = rollup.links.user
  const student = students.find(s => s.id === user)
  const student_outcomes_results = outcomes_results.filter(r => r.user_id === user).map(r => {
    const result = {...r}
    const outcome = outcomes.find(o => o.id === result.outcome_id)
    const ratings = outcome.ratings
    result['rating'] = ratings.find((r, i) => loadRating(ratings, result.score, r, i))
    return result
  })
  const row = {student, student_outcomes_results}

  rollup.scores.forEach(s => {
    const score = s.score
    const outcome = outcomes.find(o => o.id === s.links.outcome)
    const ratings = outcome.ratings
    const rating = ratings.find((r, i) => loadRating(ratings, score, r, i))

    row[`outcome_${outcome.id}`] = {
      score: s.score,
      hide_points: s.hide_points,
      rating,
      checked: true
    }
  })

  return row
}

function loadRating(ratings, score, r, i) {
  return (
    r.points == score ||
    (i == 0 && r.points < score) ||
    (r.points < score && ratings[i - 1].points > score)
  )
}

export default function Rollups(rollups, students, outcomes, outcomes_results) {
  const user_ids = [...new Set(rollups.map(r => r.links.user))]

  const filtered_rollups = rollups.reduce((r, a) => {
    r[a.links.user] = [...(r[a.links.user] || []), a]
    return r
  }, {})

  const ordered_rollups = user_ids.map(u => filtered_rollups[u])

  return ordered_rollups.map(r => loadRow(r, students, outcomes, outcomes_results)).filter(r => r !== null)
}
