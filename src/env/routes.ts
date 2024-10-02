// Static Pages

import Account from '../components/head/Account'
import Welcome from '../components/head/Welcome'
import About from '../components/pages/About/About'

// Material's Components

import CreateMaterial from '../components/pages/Materials/CreateMaterial'
import Materials from '../components/pages/Materials/Materials'
import Material from '../components/pages/Materials/Material'

// Room's Components

import CreateRoom from '../components/pages/Rooms/CreateRoom'
import Rooms from '../components/pages/Rooms/Rooms'
import Room from '../components/pages/Rooms/Room'

// Lecture's Components

import CreateLecture from '../components/pages/Lectures/CreateLecture'
import Lectures from '../components/pages/Lectures/Lectures'
import Lecture from '../components/pages/Lectures/Lecture'

// Area's Components

import CreateArea from '../components/pages/Areas/CreateArea'
import Areas from '../components/pages/Areas/Areas'
import Area from '../components/pages/Areas/Area'

// Idea's Components

import CreateIdea from '../components/pages/Ideas/CreateIdea'
import Ideas from '../components/pages/Ideas/Ideas'
import Idea from '../components/pages/Ideas/Idea'

// Profile's Components

import Profiles from '../components/pages/Profiles/Profiles'
import Profile from '../components/pages/Profiles/Profile'

// Authentication's Components

import Register from '../components/pages/Authentication/Register'
import Login from '../components/pages/Authentication/Login'

import {RouteItem} from './types'

export const items: RouteItem[] = [
    {
        title: 'Главная',
        url: '/',
        component: Account,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Главная',
        url: '/',
        component: Welcome,
        isUserAuth: false,
        inMenuExist: true
    },
    {
        title: 'О платформе',
        url: '/about',
        component: About,
        isUserAuth: false,
        inMenuExist: true
    },
    {
        title: 'Материалы',
        url: '/materials',
        component: Materials,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Комнаты',
        url: '/rooms',
        component: Rooms,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Лекции',
        url: '/lectures',
        component: Lectures,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Территории',
        url: '/areas',
        component: Areas,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Идеи',
        url: '/ideas',
        component: Ideas,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Пользователи',
        url: '/profiles',
        component: Profiles,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: '',
        url: '/register',
        component: Register,
        isUserAuth: false,
        inMenuExist: false
    },
    {
        title: '',
        url: '/login',
        component: Login,
        isUserAuth: false,
        inMenuExist: false
    },
    {
        title: '',
        url: '/profile/:id',
        component: Profile,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-material/:id',
        component: CreateMaterial,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/material/:id',
        component: Material,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-room/:id',
        component: CreateRoom,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/room/:id',
        component: Room,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-lecture/:id',
        component: CreateLecture,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/lecture/:id',
        component: Lecture,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-area/:id',
        component: CreateArea,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/area/:id',
        component: Area,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-idea/:id',
        component: CreateIdea,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/idea/:id',
        component: Idea,
        isUserAuth: true,
        inMenuExist: false
    }
]