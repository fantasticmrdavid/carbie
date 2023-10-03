import React from 'react'
import { Heading } from '@chakra-ui/react'
import { GiHamburger } from 'react-icons/gi'

type Props = {
  onClick?: () => void
  size?: 'sm' | 'lg'
}
export const Logo = ({ size, onClick }: Props) => {
  return (
    <Heading
      onClick={onClick || undefined}
      as="h1"
      size={size === 'lg' ? '2xl' : 'lg'}
      noOfLines={1}
      style={{
        display: 'flex',
        gap: '0.15em',
        cursor: onClick ? 'pointer' : undefined,
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      ~ Carbie <GiHamburger /> ~
    </Heading>
  )
}
