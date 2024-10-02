import React, {useState, useRef, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {onEstimatePasswordDifficulty} from '../../../../utils/features'
import {updateProfilePasswordM} from '../gql'
import {PASSWORD_POWER_COLORS, PASSWORD_DEFAULT_COLOR, PASSWORD_ITEMS_SIZE} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountSecurityPage: React.FC<AccountPropsType> = ({profile}) => {    
    const newPasswordInput = useRef(null)

    const [passwords] = useState<string[]>(new Array(PASSWORD_ITEMS_SIZE).fill('').map(() => uniqid()))
    const [state, setState] = useState({
        current_password: '', 
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePassword)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let input = newPasswordInput.current
        let points = onEstimatePasswordDifficulty(new_password)
        let colors = PASSWORD_POWER_COLORS.filter(el => points >= el.points)
        let latest = colors[colors.length - 1]

        if (input) {
            if (Boolean(colors.length)) {
                input.style.borderBottom = `.2rem solid ${latest.title}`
            } else {
                input.style.borderBottom = `.2rem solid ${PASSWORD_DEFAULT_COLOR}`
            }
        } 

    }, [new_password])

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                id: profile.shortid, current_password, new_password
            }
        })
    }

    return (
        <>
            <h2>Безопасность</h2>

            <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Текущий пароль' type='text' />
            
            <h4 className='pale'>Рекомендуемые пароли</h4>
            
            <div className='items small'>
                {passwords.map(el => <div onClick={() => setState({...state, new_password: new_password !== el ? el : ''})} className='item'>{el}</div>)}
            </div>

            <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} ref={newPasswordInput} placeholder='Новый пароль' type='text' />       
        
            <button onClick={onUpdate}>Обновить</button>
        </>
    )
}

export default AccountSecurityPage