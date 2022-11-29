import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Rating = ({
  rating,
  showText = true,
  editable = false,
  maxRating = 5,
  size = '1x',
  onChange
}: {
  rating: number
  showText?: boolean
  editable?: boolean
  maxRating?: number
  size?: '1x' | '2x'
  onChange?: (rating: number) => void
}) => {
  const [isHover, setIsHover] = useState(false)
  const [ratingTemp, setRatingTemp] = useState(rating)
  const [ratingSaved, setRatingSaved] = useState(rating)

  const onMouseEnter = useCallback((i: number) => {
    if (editable) {
      setIsHover(true)
      setRatingTemp(i)
    }
  }, [editable])

  const onmouseleave = useCallback(() => {
    if (editable) {
      setIsHover(false)
      setRatingTemp(ratingSaved)
    }
  }, [editable, ratingSaved])

  const onClick = useCallback((i: number) => {
    if (editable) {
      setRatingSaved(i)

      if (onChange) {
        onChange(i)
      }
    }
  }, [editable, onChange])

  return (
    <span className="rating-stars mt-1">
      {_.range(maxRating).map((_, i) => (
        <span
          key={i}
          className={editable ? 'star-edit' : ''}
          onMouseEnter={() => onMouseEnter(i + 1)}
          onMouseLeave={() => onmouseleave()}
          onClick={() => onClick(i + 1)}
        >
          <FontAwesomeIcon
            key={i}
            size={size}
            icon="star"
            className={(() => {
              if (!isHover && i < ratingSaved) {
                return 'checked'
              }

              if (isHover && i < ratingTemp) {
                return 'checked'
              }
              return ''
            })()}
          />
        </span>
      ))}
      <>
        {showText && (
          <span style={{ display: 'inline-block', marginLeft: '5px' }}>
            {ratingSaved}
          </span>
        )}
      </>
    </span>
  )
}

export default Rating
