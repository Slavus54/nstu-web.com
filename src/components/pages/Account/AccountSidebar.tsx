import React, {useState, useLayoutEffect} from 'react'
import {onHandleKeyboardTrigger} from '../../../utils/features'
import ImageLook from '../../../shared/UI/ImageLook'
import Loading from '../../../shared/UI/Loading'
import {parts} from '../../../env/parts'
import {AccountPropsType, AccountPart} from '../../../env/types'

const AccountSidebar: React.FC<AccountPropsType> = ({profile}) => {
    const [part, setPart] = useState<AccountPart>(parts[0])

    useLayoutEffect(() => onHandleKeyboardTrigger(() => setPart(parts[0]), 'Escape'), [])

    return (
        <>
            <div className='profile-menu'>
                {parts.map((el, i) => 
                    <div onClick={() => setPart(el)}  key={i} className='profile-menu__item'>
                        <ImageLook src={el.url} className='icon' alt='icon' />
                    </div>
                )}
            </div>
        
            {part !== null && profile !== null ? <part.component profile={profile} /> : <Loading label='Загрузка ваших данных' />}
        </>
    )
}

export default AccountSidebar