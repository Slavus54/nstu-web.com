import React from 'react'
import {LoadingPropsType} from '../../env/types'

const Loading: React.FC<LoadingPropsType> = ({label = ''}) => 
<>
    <img src='../loading.gif' className='loader' alt='Loading' />
    {label}...
</>

export default Loading