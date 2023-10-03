import React from 'react'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { Flex } from '@chakra-ui/react'
import { Logo } from '@/app/components/Logo/Logo'
import styles from './navBar.module.scss'
import { useRouter } from 'next/router'

export const NavBar = () => {
  const router = useRouter()
  return (
    <nav className={styles.nav}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Logo
          onClick={() => {
            router.push(`/`)
          }}
        />
        <IngredientSearch />
      </Flex>
    </nav>
  )
}
