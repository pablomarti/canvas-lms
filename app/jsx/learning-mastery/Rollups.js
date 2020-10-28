function loadRow(rollups_group, students) {
  const rollup = rollups_group[0]

  const user = rollup.links.user
  const student = students.find(s => s.id === user)
  const row = {student: student}

  rollup.scores.forEach(s => row[`outcome_${s.links.outcome}`] = {score: s.score, hide_points: s.hide_points})

  return row
}

export default function Rollups(rollups, students) {
  const user_ids = [...new Set(rollups.map(r => r.links.user))]

  const filtered_rollups = rollups.reduce((r, a) => {
   r[a.links.user] = [...r[a.links.user] || [], a]
   return r
  }, {})

  const ordered_rollups = user_ids.map(u => filtered_rollups[u])

  return ordered_rollups.map(r => loadRow(r, students)).filter(r => r !== null)
}
