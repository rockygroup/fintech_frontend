'use client'
import { Text } from '@chakra-ui/react'
import React from 'react'

const DateFormatter = (props) => {
  const {children, ...rest} = props
  return (
    <>
        <Text>{new Date(children)?.toLocaleString("en-GB")}</Text>
    </>
  )
}

export default DateFormatter