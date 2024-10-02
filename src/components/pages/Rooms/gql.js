import {gql} from '@apollo/client'

// query

export const getRoomsQ = gql`
    query {
        getRooms {
            shortid
            name
            title
            faculty
            dormitory
            num
        }
    }
`

// mutations

export const createRoomM = gql`
    mutation createRoom($name: String!, $id: String!, $title: String!, $faculty: String!, $dormitory: String!, $num: Float!, $weekday: String!, $time: String!, $cords: ICord!, $role: String!) {
        createRoom(name: $name, id: $id, title: $title, faculty: $faculty, dormitory: $dormitory, num: $num, weekday: $weekday, time: $time, cords: $cords, role: $role) 
    }
`

export const getRoomM = gql`
    mutation getRoom($id: String!) {
        getRoom(id: $id) {
            shortid
            name
            title
            faculty
            dormitory
            num
            weekday
            time
            cords {
                lat
                long
            }
            members {
                shortid
                name
                role
            }
            tasks {
                shortid
                name
                text
                category
                deadline
                image
            }
        }
    }
`

export const manageRoomStatusM = gql`
    mutation manageRoomStatus($name: String!, $id: String!, $option: String!, $role: String!) {
        manageRoomStatus(name: $name, id: $id, option: $option, role: $role) 
    }
`

export const updateRoomInformationM = gql`
    mutation updateRoomInformation($name: String!, $id: String!, $weekday: String!, $time: String!) {
        updateRoomInformation(name: $name, id: $id, weekday: $weekday, time: $time) 
    }
`

export const manageRoomTaskM = gql`
    mutation manageRoomTask($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $deadline: String!, $image: String!, $collId: String!) {
        manageRoomTask(name: $name, id: $id, option: $option, text: $text, category: $category, deadline: $deadline, image: $image, collId: $collId) 
    }
`