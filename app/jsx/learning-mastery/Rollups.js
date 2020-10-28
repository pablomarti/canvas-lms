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

function loadRow(rollups_group, students) {
  const rollup = rollups_group[0]

  const user = rollup.links.user
  const student = students.find(s => s.id === user)
  const row = {student}

  rollup.scores.forEach(
    s => (row[`outcome_${s.links.outcome}`] = {score: s.score, hide_points: s.hide_points})
  )

  return row
}

export default function Rollups(rollups, students) {
  const user_ids = [...new Set(rollups.map(r => r.links.user))]

  const filtered_rollups = rollups.reduce((r, a) => {
    r[a.links.user] = [...(r[a.links.user] || []), a]
    return r
  }, {})

  const ordered_rollups = user_ids.map(u => filtered_rollups[u])

  return ordered_rollups.map(r => loadRow(r, students)).filter(r => r !== null)
}
