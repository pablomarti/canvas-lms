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

import React from 'react'
// import {PieChart} from 'react-minimal-pie-chart'

export default ({ratings, average}) => {
  const envRatings = ENV.GRADEBOOK_OPTIONS.outcome_proficiency.ratings
  const data = ratings.map((rating, index) => {
    return {
      title: rating.description,
      value: rating.percent[0],
      color: '#' + envRatings[index].color
    }
  })

  return (
    <div style={{display: 'flex'}}>
      <div className="chart" style={{float: 'left', padding: '20px'}}>
        {/* <PieChart
          data={data}
          lineWidth={15}
          paddingAngle={5}
          style={{width: '160px', height: '150px'}}
        /> */}
        <AverageLabel average={average} />
      </div>
      <div style={{padding: '20px'}}>
        <Ratings envRatings={envRatings} percents={ratings} />
      </div>
    </div>
  )
}

const AverageLabel = ({average}) => {
  const styles = {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontSize: '14px',
    marginTop: '-120px'
  }
  const stylesAverage = {
    fontWeight: 'bold',
    fontSize: '36px'
  }
  return (
    <div style={styles}>
      <div style={stylesAverage}> {average.score} </div>
      <div> Class Average </div>
    </div>
  )
}

const Ratings = ({envRatings, percents}) => {
  const masteryRating = envRatings.find(rating => !!rating.mastery)
  const masteryAt = masteryRating.points
  const icons = envRatings.map(rating => getIconClass(rating.points, masteryAt))
  return (
    <div style={{transform: 'scale(.8)'}}>
      {percents.map((percent, index) =>
        renderRatingPercent(envRatings[index], icons[index], percent)
      )}
    </div>
  )
}

export const getIconClass = (points, masteryAt) => {
  console.log(typeof points)
  if (typeof points === 'undefined') {
    return 'not-assessed'
  }
  const score = points - masteryAt
  switch (true) {
    case score > 0:
      return 'mastery-star'
    case score === 0:
      return 'mastery'
    case score < 0 && score > -1 * masteryAt:
      return 'partial-mastery'
    default:
      return 'no-mastery'
  }
}

const renderRatingPercent = (rating, icon, percent) => {
  return (
    <div style={{paddingBottom: '14px', display: 'flex'}}>
      <div className="outcome-proficiency-dot" style={{backgroundColor: '#' + rating.color}}>
        <div className={icon} />
      </div>
      <div style={{paddingLeft: '12px', paddingRight: '12px'}}>
        {percent.percent[0]}% - {percent.percent[1]} {rating.description}
      </div>
    </div>
  )
}
