import AddressImage from '../../assets/geo/address--v1.png'
import VisitImage from '../../assets/geo/visit--v1.png'

const MapPicker = ({type = 'home'}) => <img src={type === 'home' ? AddressImage : VisitImage} className='icon' /> 

export default MapPicker