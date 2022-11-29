import React, { useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import { useQuery } from '@apollo/client'
import { ONLINE_TEACHERS } from '../graphql'
import { TeacherSummary, PageLoader } from '../components'
import { useCurrentUser } from '../hooks'
import Alert from '../components/Alert'

const FindTeacher = () => {
  const mixpanel = useMixpanel()

  const { currentUser, error, isCurrentUserAvailable } = useCurrentUser()

  const LANGUAGE_ID = 2 // Hardcoded for Spanish 🇪🇸

  const { loading: loadingOnlineTeachers, data: onlineTeacherData } = useQuery(
    ONLINE_TEACHERS,
    {
      variables: {
        languageId: LANGUAGE_ID,
        offset: 0,
        limit: 15,
      },
    }
  )

  useEffect(() => mixpanel.track('Loaded Teacher Search page'), [mixpanel])

  return (
    <>
      {error ? (
        <Alert error={error} />
      ) : loadingOnlineTeachers || !isCurrentUserAvailable() ? (
        <PageLoader />
      ) : (
        <div>
          {onlineTeacherData &&
            onlineTeacherData.online_teachers
              .map((onlineTeacher) => onlineTeacher.user)
              // Filter self
              .filter(
                (onlineTeacherUser) =>
                  onlineTeacherUser.id !== currentUser.user_id
              )
              .map((onlineTeacher: any) => {
                const teacherLanguageId = onlineTeacher.languages
                  .filter(
                    (teacherLanguage) =>
                      teacherLanguage.language.id === LANGUAGE_ID
                  )
                  .pop().id

                return (
                  <div key={onlineTeacher.id}>
                    <TeacherSummary
                      teacher={onlineTeacher}
                      languageId={teacherLanguageId}
                    />
                  </div>
                )
              })}
        </div>
      )}
    </>
  )
}

export default FindTeacher
