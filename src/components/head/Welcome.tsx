import React, {useLayoutEffect} from 'react'
import {codus} from '../../shared/libs/libs'
import {changeTitle} from '../../utils/notifications'
import ImageLook from '../../shared/UI/ImageLook'
import RouterNavigator from '../router/RouterNavigator'
import {PROJECT_TITLE, COMPONENTS, LINKS} from '../../env/env'

const Welcome: React.FC = () => {
    useLayoutEffect(() => {
        changeTitle('Главная')
    }, [])

    return (
        <>
            <h1>{PROJECT_TITLE}</h1>
            
            <h4 className='pale'>Платформа для студентов, преподавателей и сотрудников НГТУ</h4>

            <div className='items little'>
                <RouterNavigator url='/login'>
                    <button>Войти</button>
                </RouterNavigator>
                <RouterNavigator url='/register'>
                    <button>Аккаунт</button>
                </RouterNavigator>
            </div>    

            <h2>Компоненты</h2>

            <div className='items'>
                {COMPONENTS.map(el => <div className='item card'>{el}</div>)}
            </div>

            <h2>Ссылки</h2>

            <div className='items little'>
                {LINKS.map(el => <ImageLook onClick={() => codus.go(el.link)} src={el.icon} className='icon' />)}
            </div>   
        </>
    )
}

export default Welcome