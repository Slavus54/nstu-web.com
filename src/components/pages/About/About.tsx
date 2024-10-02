import React, {useLayoutEffect} from 'react'
import {changeTitle} from '../../../utils/notifications'
import ImageLook from '../../../shared/UI/ImageLook'
import {PROJECT_TITLE} from '../../../env/env'
import {TECHNOLOGIES} from './env'

const About: React.FC = () => {
    useLayoutEffect(() => {
        changeTitle('О платформе')
    }, [])

    return (
        <>
            <h1>{PROJECT_TITLE}</h1>  

            <p className='pale green'>
                Открытая платформа для широкого взаимодействия людей, объединенных НГТУ <br />
                и желающих повысить качество своего обучения в лучшем техническом вузе Сибири.
            </p>

            <p className='pale red'>
                Мы собрали топовые идеи для вашего развития, общения и развлечения на одном сайте. <br />
                У вас будет личный кабинет, где можно добавлять достижений и управлять своими проектами. <br />
                Также, можно найти или создать собственный компонент - некую цифровую сущность различной направленности. 
            </p>

            <h1>Технологии</h1>

            <div className='items half'>
                {TECHNOLOGIES.map(el => 
                    <div className='item part'>
                        <ImageLook src={el.icon} className='icon' />
                        <b>{el.title}</b>
                    </div>
                )}
            </div>
        </>
    )
}

export default About