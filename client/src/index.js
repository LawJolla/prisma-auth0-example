import React from 'react'
import Link from "next/link"
import MainLayout from "../layouts/main"
import Callback from './components/Callback'
import Feed from "./components/Feed"

const HomePage = () => (

  <MainLayout>

    <div className='fl w-100 pl4 pr4'>
      <Feed />
    </div>
  </MainLayout>

)

export default HomePage