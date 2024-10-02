import {gql} from '@apollo/client'

// query

export const getAreasQ = gql`
    query {
        getAreas {
            shortid
            name
            title
            category
            region
            cords {
                lat
                long
            }
            faculty
        }
    }
`

// mutations

export const createAreaM = gql`
    mutation createArea($name: String!, $id: String!, $title: String!, $category: String!, $century: String!, $region: String!, $cords: ICord!, $faculty: String!) {
        createArea(name: $name, id: $id, title: $title, category: $category, century: $century, region: $region, cords: $cords, faculty: $faculty) 
    }
` 

export const getAreaM = gql`
    mutation getArea($id: String!) {
        getArea(id: $id) {
            shortid
            name
            title
            category
            century
            region
            cords {
                lat
                long
            }
            faculty
            locations {
                shortid
                name
                title
                category
                term
                cords {
                    lat
                    long
                }
                stage
                image
                likes
            }
            facts {
                shortid
                name
                text
                level
                isTruth
                dateUp
            }
        }
    }
`

export const manageAreaLocationM = gql`
    mutation manageAreaLocation($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $term: String!, $cords: ICord!, $stage: String!, $image: String!, $likes: String!, $collId: String!) {
        manageAreaLocation(name: $name, id: $id, option: $option, title: $title, category: $category, term: $term, cords: $cords, stage: $stage, image: $image, likes: $likes, collId: $collId) 
    }
` 

export const updateAreaFacultyM = gql`
    mutation updateAreaFaculty($name: String!, $id: String!, $faculty: String!) {
        updateAreaFaculty(name: $name, id: $id, faculty: $faculty) 
    }
` 

export const offerAreaFactM = gql`
    mutation offerAreaFact($name: String!, $id: String!, $text: String!, $level: String!, $isTruth: Boolean!, $dateUp: String!) {
        offerAreaFact(name: $name, id: $id, text: $text, level: $level, isTruth: $isTruth, dateUp: $dateUp) 
    }
` 