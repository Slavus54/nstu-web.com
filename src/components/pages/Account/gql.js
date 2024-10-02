import {gql} from '@apollo/client'

export const getProfileM = gql`
    mutation getProfile($id: String!) {
        getProfile(id: $id) {
            shortid
            name
            email
            password
            region
            cords {
                lat
                long
            }
            status
            points
            image
            timestamp
            achievements {
                shortid
                title
                category
                image
                dateUp
            }
            projects {
                shortid
                title
                category
                progress
                image
                likes
            }
            components {
                shortid
                title
                url
            }
        }
    }
`

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($id: String!, $image: String!) {
        updateProfilePersonalInfo(id: $id, image: $image)
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(id: $id, region: $region, cords: $cords)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($id: String!, $current_password: String!, $new_password: String!) {
        updateProfilePassword(id: $id, current_password: $current_password, new_password: $new_password)
    }
`

export const manageProfileAchievementM = gql`
    mutation manageProfileAchievement($id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $dateUp: String!, $collId: String!) {
        manageProfileAchievement(id: $id, option: $option, title: $title, category: $category, image: $image, dateUp: $dateUp, collId: $collId)
    }
`

export const manageProfileProjectM = gql`
    mutation manageProfileProject($id: String!, $option: String!, $title: String!, $category: String!, $progress: Float!, $image: String!, $likes: String!, $collId: String!) {
        manageProfileProject(id: $id, option: $option, title: $title, category: $category, progress: $progress, image: $image, likes: $likes, collId: $collId)
    }
`