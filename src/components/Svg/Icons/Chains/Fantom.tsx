import React from 'react'
import Svg from '../../Svg'
import { SvgProps } from '../../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 34 34" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.418 13.8123L22.668 11.3332V16.2915L18.418 13.8123ZM22.668 24.4373L17.0013 27.7429L11.3346 24.4373V18.6526L17.0013 21.9582L22.668 18.6526V24.4373ZM11.3346 11.3332L15.5846 13.8123L11.3346 16.2915V11.3332ZM17.7096 14.9929L21.9596 17.4721L17.7096 19.9512V14.9929ZM16.293 19.9512L12.043 17.4721L16.293 14.9929V19.9512ZM21.9596 10.1526L17.0013 12.9859L12.043 10.1526L17.0013 7.20123L21.9596 10.1526ZM9.91797 9.68039V25.1457L17.0013 29.1596L24.0846 25.1457V9.68039L17.0013 5.6665L9.91797 9.68039Z"
        fill="#FFFFFF"
      />
    </Svg>
  )
}

export default Icon
