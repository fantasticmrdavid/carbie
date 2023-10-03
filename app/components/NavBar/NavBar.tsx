import React from 'react'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { Button, Flex } from '@chakra-ui/react'
import { Logo } from '@/app/components/Logo/Logo'
import styles from './navBar.module.scss'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

export const NavBar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <nav className={styles.nav}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Logo
          onClick={() => {
            router.push(`/`)
          }}
        />
        <Flex gap={'0.5em'} alignItems={'center'}>
          <IngredientSearch />
          {!session && <Button onClick={() => signIn()}>Sign in</Button>}
        </Flex>
      </Flex>
    </nav>
  )
}
