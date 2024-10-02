import {SimpleTriggerProps} from '../../env/types'

const CloseIt: React.FC<SimpleTriggerProps> = ({onClick}) => <img src='https://img.icons8.com/ios/50/delete-sign.png' className='close' onClick={onClick} alt='close' />

export default CloseIt