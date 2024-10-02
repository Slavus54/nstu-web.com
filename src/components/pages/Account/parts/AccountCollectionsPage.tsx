import React, {useState, useMemo} from 'react'
import {codus} from '../../../../shared/libs/libs'
import RouterNavigator from '../../../router/RouterNavigator'
import DataPagination from '../../../../shared/UI/DataPagination'
import {SEARCH_PERCENT} from '../../../../env/env'
import {components} from '../../../../env/collections'
import {AccountPropsType, AccountCollectionType} from '../../../../env/types'

const AccountCollectionsPage: React.FC<AccountPropsType> = ({profile}) => {   
    const [collections, setCollections] = useState<AccountCollectionType[]>([])
    
    const [title, setTitle] = useState<string>('')
 
    useMemo(() => {
        let result: AccountCollectionType[] = profile.components

        if (title.length !== 0) {
            result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
        }

        setCollections(result)
    }, [title])
    
    return (
        <>
            <h2>Компоненты</h2>

            <div className='items medium'>
                {components.map(el => 
                    <div className='item'>
                        <RouterNavigator url={`/create-${el.url}/${profile.shortid}`}>
                            {el.title}
                        </RouterNavigator>
                    </div>
                )}
            </div>
            
            <h2>Поиск</h2>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название компонента....' type='text' />

            <DataPagination items={profile.components} setItems={setCollections} label='Список компонентов:' />
            <div className='items half'>
                {collections.map(el => 
                    <div className='item panel'>
                        <RouterNavigator url={`/${el.url}/${el.shortid}`}>
                            {codus.short(el.title)}
                        </RouterNavigator>
                        <small>{el.url}</small>
                    </div>
                )}
            </div>            
        </>
    )
}

export default AccountCollectionsPage