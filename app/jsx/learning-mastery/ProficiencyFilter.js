/*
 * Copyright (C) 2019 - present Instructure, Inc.
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

import React from 'react'
import {arrayOf, shape, string, func} from 'prop-types'
import {Tabs} from '@instructure/ui-tabs'
import {getIconClass} from '../outcomes/ColumnTooltip'

function renderProficiencies(rating, icon) {
  return (
    <div
      className={`outcome-proficiency-pill ${rating.checked ? 'checked' : ''}`}
      onClick={e => rating.onClick(e)}
    >
      <div className="outcome-proficiency-dot" style={{backgroundColor: ("#" + rating.color)}}>
        <div className={icon} />
      </div>
      <div className="outcome-proficiency-description">{rating.description}</div>
    </div>
  )
}

function renderPills(ratings) {
  const masteryRating = ratings.find(rating => !!rating.mastery)
  const masteryAt = masteryRating.points
  ratings = [
    ...ratings,
    {points: null, mastery: false, description: 'Not Assessed', checked: true, onClick: () => {}} // TODO: Not functional
  ]
  return ratings.map(rating => renderProficiencies(rating, getIconClass(rating.points, masteryAt)))
}

function pills(ratings) {
  return (
    <div style={{display: 'flex'}}>
      <div style={{padding: '10px', fontWeight: 'bold'}}>Showing:</div>
      <div className="outcome-proficiency-pills">{renderPills(ratings)}</div>
    </div>
  )
}

export const GradebookTab = () => {
  return (
    <Tabs>
      <Tabs.Panel renderTitle="Gradebook" textAlign="center" isSelected></Tabs.Panel>
    </Tabs>
  )
}

export default function ProficiencyFilter(props) {
  const {ratings} = props
  return <div style={{padding: '6px'}}>{pills(ratings)}</div>
}

ProficiencyFilter.propTypes = {
  ratings: arrayOf(
    shape({
      color: string.isRequired,
      description: string.isRequired,
      onClick: func.isRequired
    })
  ).isRequired
}
