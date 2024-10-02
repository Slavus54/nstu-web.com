import AccountPersonalPage from '../components/pages/Account/parts/AccountPersonalPage'
import AccountGeoPage from '../components/pages/Account/parts/AccountGeoPage'
import AccountSecurityPage from '../components/pages/Account/parts/AccountSecurityPage'
import AccountAchievementsPage from '../components/pages/Account/parts/AccountAchievementsPage'
import AccountProjectsPage from '../components/pages/Account/parts/AccountProjectsPage'
import AccountCollectionsPage from '../components/pages/Account/parts/AccountCollectionsPage'

import {AccountPart} from './types'

export const parts: AccountPart[] = [
    {
        url: './profile/account.png',
        component: AccountPersonalPage
    },
    {
        url: './profile/geo.png',
        component: AccountGeoPage
    },
    {
        url: './profile/security.png',
        component: AccountSecurityPage
    },
    {
        url: './profile/achievement.png',
        component: AccountAchievementsPage
    },
    {
        url: './profile/project.png',
        component: AccountProjectsPage
    },
    {
        url: './profile/collections.png',
        component: AccountCollectionsPage
    }
]