import {ImageLookProps} from '../../env/types'

const ImageLook: React.FC<ImageLookProps> = ({src, className = 'photo', onClick = () => {}, alt = 'photo'}) => {
    return (
        <div className='center'>
            <img src={src} onClick={onClick} className={className} alt={alt} loading='lazy' />
        </div>
    )
}

export default ImageLook