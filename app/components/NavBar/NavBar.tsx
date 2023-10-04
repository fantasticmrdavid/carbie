import React from 'react'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { Button, Flex } from '@chakra-ui/react'
import { Logo } from '@/app/components/Logo/Logo'
import styles from './navBar.module.scss'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export const NavBar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Logo
          onClick={() => {
            router.push(`/`)
          }}
        />
      </Flex>
      <Flex className={styles.navRight}>
        {pathname !== '/' && <IngredientSearch />}
        {!session && <Button onClick={() => signIn()}>Sign in</Button>}
      </Flex>
    </nav>
  )
}
