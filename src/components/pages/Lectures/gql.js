import {gql} from '@apollo/client'

// query

export const getLecturesQ = gql`
    query {
        getLectures {
            shortid
            name
            title
            category
            status
            duration
            time
            dateUp
        }
    }
`

// mutations

export const createLectureM = gql`
    mutation createLecture($name: String!, $id: String!, $title: String!, $category: String!, $status: String!, $duration: String!, $url: String!, $time: String!, $dateUp: String!, $stream: String!, $card: String!) {
        createLecture(name: $name, id: $id, title: $title, category: $category, status: $status, duration: $duration, url: $url, time: $time, dateUp: $dateUp, stream: $stream, card: $card)
    }
`

export const getLectureM = gql`
    mutation getLecture($id: String!) {
        getLecture(id: $id) {
            shortid
            name
            title
            category
            status
            duration
            url
            time
            dateUp
            stream
            card
            questions {
                shortid
                name
                text
                level
                reply
                dateUp
            }
            details {
                shortid
                name
                title
                category
                image
                rating
            }
        }
    }
`

export const manageLectureQuestionM = gql`
    mutation manageLectureQuestion($name: String!, $id: String!, $option: String!, $text: String!, $level: String!, $reply: String!, $dateUp: String!, $collId: String!) {
        manageLectureQuestion(name: $name, id: $id, option: $option, text: $text, level: $level, reply: $reply, dateUp: $dateUp, collId: $collId)
    }
`

export const updateLectureInformationM = gql`
    mutation updateLectureInformation($name: String!, $id: String!, $stream: String!, $card: String!) {
        updateLectureInformation(name: $name, id: $id, stream: $stream, card: $card)
    }
`

export const manageLectureDetailM = gql`
    mutation manageLectureDetail($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $rating: Float!, $collId: String!) {
        manageLectureDetail(name: $name, id: $id, option: $option, title: $title, category: $category, image: $image, rating: $rating, collId: $collId)
    }
`