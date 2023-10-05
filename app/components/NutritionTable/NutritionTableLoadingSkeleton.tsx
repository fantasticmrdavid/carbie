import React from 'react'
import { Heading, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'
import { Skeleton, SkeletonText } from '@chakra-ui/react'

export const NutritionTableLoadingSkeleton = () => {
  return (
    <div>
      <Heading as="h5" noOfLines={1} size={'md'}>
        <Skeleton height={'20px'} width={'50%'} mb={'2'} />
      </Heading>
      <TableContainer>
        <Table size="sm">
          <Tbody>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
              <Td display={'flex'} justifyContent={'flex-end'}>
                <SkeletonText noOfLines={1} width={'50px'} py={'1'} />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
