import React from 'react'
import { useRouter } from 'next/router'
import { TbArrowBack } from 'react-icons/tb'
import { Tooltip } from '@chakra-ui/react'

export const BackButton = () => {
  const router = useRouter()

  return (
    <Tooltip label={'Go back'} placement={'right-start'} hasArrow>
      <div
        style={{
          display: 'inline-flex',
          position: 'relative',
          alignItems: 'center',
          gap: '0.2em',
          cursor: 'pointer',
        }}
        onClick={() => router.back()}
      >
        <span style={{ fontSize: '1.5em' }}>
          <TbArrowBack />
        </span>{' '}
        Back
      </div>
    </Tooltip>
  )
}
