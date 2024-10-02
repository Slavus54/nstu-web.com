import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import {codus, datus} from '../../../../shared/libs/libs'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {classHandler} from '../../../../utils/css'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import DataPagination from '../../../../shared/UI/DataPagination'
import CloseIt from '../../../../shared/UI/CloseIt'
import {manageProfileAchievementM} from '../gql'
import {ACHIEVEMENT_TYPES} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountAchievementsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)

    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: ACHIEVEMENT_TYPES[0], 
        dateUp: datus.now('date')
    })

    const {title, category, dateUp} = state

    const [manageProfileAchievement] = useMutation(manageProfileAchievementM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAchievement)
            updateProfileInfo(null)

            setState({...state, title: '', category: ACHIEVEMENT_TYPES[0]})
        }
    })

    const onManageAchievement = (option: string) => {
        manageProfileAchievement({
            variables: {
                id: profile.shortid, option, title, category, image, dateUp, collId: achievement !== null ? achievement.shortid : ''
            }
        })
    }

    return (
        <>
            {achievement === null ?
                    <>
                        <h2>Новое Достижение</h2>

                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Чего вы достигли...' />
                       
                        <div className='items small'>
                            {ACHIEVEMENT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageAchievement('create')}>Добавить</button>

                        <DataPagination items={profile.achievements} setItems={setAchievements} label='Портфолио:' />

                        <div className='items half'>
                            {achievements.map(el => 
                                <div onClick={() => setAchievement(el)} className='item card'>
                                    {codus.short(el.title)}
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setAchievement(null)} />

                        {achievement.image !== '' && <ImageLook src={achievement.image} className='photo' />}

                        <h2>{achievement.title}</h2>
                        <h4 className='pale'>Тип: {achievement.category}</h4>

                        <button onClick={() => onManageAchievement('delete')}>Удалить</button>
                    </>
            }
        </>
    )
}

export default AccountAchievementsPage