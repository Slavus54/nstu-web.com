import React, {useState, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import ProfilePhoto from '../../../../assets/photo/profile_photo.jpg'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import VoiceHelper from '../../../../shared/UI/VoiceHelper'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfilePersonalInfoM} from '../gql'
import {AccountPropsType} from '../../../../env/types'

const AccountPersonalPage: React.FC<AccountPropsType> = ({profile}) => {
    const [image, setImage] = useState<string>('')

    useLayoutEffect(() => {
        if (profile !== null) {
            setImage(profile.image === '' ? ProfilePhoto : profile.image)
        }


    }, [profile])

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePersonalInfo)
            updateProfileInfo(null)
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                id: profile.shortid, image
            }
        })
    }

    return (
        <div className='main'>
            <ImageLook src={image} className='photo' alt="фотография аккаунта" />
           
            <h3><b>{profile.name}</b></h3> 
            <h4 className='pale'>({profile.status})</h4>

            <ImageLoader setImage={setImage} />

            <button onClick={onUpdate}>Обновить</button>

            <VoiceHelper />
        </div>
    )
}

export default AccountPersonalPage