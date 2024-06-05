'use client'
import React from 'react'
import { useParams } from 'next/navigation'
const CategoryFillter = () => {
     const {id} = useParams()
  return (
    <div>CategoryFilter {id}</div>
  )
}

export default CategoryFillter