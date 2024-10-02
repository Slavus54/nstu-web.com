import {useState} from 'react'
import {ImageLoaderProps} from '../../env/types'

const ImageLoader: React.FC<ImageLoaderProps> = ({setImage}) => {

    const onLoad = (e: any) => {
        let reader = new FileReader()

        reader.onload = (file: any) => {
            setImage(file.target.result)
        }

        let file = e.target.files[0]

        reader.readAsDataURL(file)
    }

    return (
        <>
            <input onChange={e => onLoad(e)} type='file' id='loader' accept='image/*' required />
            <label htmlFor='loader' />
        </>
    )
}

export default ImageLoader