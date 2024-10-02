import {gql} from '@apollo/client'

// query

export const getProfilesQ = gql`
    query getProfiles {
        getProfiles {
            shortid
            name
            region
            cords {
                lat
                long
            }
            status
        }
    }
`

// mutations

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
            account_components {
                shortid
                title
                url
            }
        }
    }
`

export const manageProfileProjectM = gql`
    mutation manageProfileProject($id: String!, $option: String!, $title: String!, $category: String!, $progress: Float!, $image: String!, $likes: String!, $collId: String!) {
        manageProfileProject(id: $id, option: $option, title: $title, category: $category, progress: $progress, image: $image, likes: $likes, collId: $collId)
    }
`