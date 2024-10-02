import {gql} from '@apollo/client'

// query

export const getIdeasQ = gql`
    query {
        getIdeas {
            shortid
            name
            title
            category
            stage
        }
    }
`

// mutations

export const createIdeaM = gql`
    mutation createIdea($name: String!, $id: String!, $title: String!, $concept: String!, $category: String!, $url: String!, $roles: [String]!, $stage: String!, $need: Float!)  {
        createIdea(name: $name, id: $id, title: $title, concept: $concept, category: $category, url: $url, roles: $roles, stage: $stage, need: $need) 
    }
`

export const getIdeaM = gql`
    mutation getIdea($id: String!) {
        getIdea(id: $id) {
            shortid
            name
            title
            concept
            category
            url
            roles
            stage
            need
            thoughts {
                shortid
                name
                title
                category
                rating
                image
            }
            quotes {
                shortid
                name
                text
                status
                faculty
                dateUp
            }
        }
    }
`

export const manageIdeaThoughtM = gql`
    mutation manageIdeaThought($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $rating: Float!, $image: String!, $collId: String!)  {
        manageIdeaThought(name: $name, id: $id, option: $option, title: $title, category: $category, rating: $rating, image: $image, collId: $collId) 
    }
`

export const updateIdeaInformationM = gql`
    mutation updateIdeaInformation($name: String!, $id: String!, $stage: String!, $need: Float!)  {
        updateIdeaInformation(name: $name, id: $id, stage: $stage, need: $need) 
    }
`

export const publishIdeaQuoteM = gql`
    mutation publishIdeaQuote($name: String!, $id: String!, $text: String!, $status: String!, $faculty: String!, $dateUp: String!)  {
        publishIdeaQuote(name: $name, id: $id, text: $text, status: $status, faculty: $faculty, dateUp: $dateUp) 
    }
`