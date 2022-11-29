import styledComponents  from 'styled-components'
import type { WrapperProps } from '../../types/wrapper'

const Wrapper = styledComponents.div<WrapperProps>`
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
`

export default Wrapper
