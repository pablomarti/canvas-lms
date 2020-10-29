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
import {Flex} from '@instructure/ui-flex'
import OutcomeColumnView from 'compiled/views/gradebook/OutcomeColumnView'
import $ from 'jquery'

class StudentCell extends React.Component {

  static defaultProps = {
    user: {}
  }

  render() {
    const {user, courseId, sectionName} = this.props
    const grades_html_url = `/courses/${courseId}/grades/${user.id}#tab-outcomes`
    return (
      <div class="outcome-student-cell-content">
        {/* {{>avatar}} */}
        <a class="student-grades-list student_context_card_trigger"
          data-student_id={user.id} data-course_id={courseId}
          href={grades_html_url}>{user.display_name}</a>
        <div class="student-section">{sectionName}</div>
      </div>
    )
  }
}

export default StudentCell
