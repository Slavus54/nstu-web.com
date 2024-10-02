import {gql} from '@apollo/client'

// query

export const getMaterialsQ = gql`
    query {
        getMaterials {
            shortid
            name
            title
            category
            course
            year
        }
    }
`

// mutations

export const createMaterialM = gql`
    mutation createMaterial($name: String!, $id: String!, $title: String!, $category: String!, $course: Float!, $subjects: [String]!, $year: Float!, $rating: Float!) {
        createMaterial(name: $name, id: $id, title: $title, category: $category, course: $course, subjects: $subjects, year: $year, rating: $rating)
    }
`

export const getMaterialM = gql`
    mutation getMaterial($id: String!) {
        getMaterial(id: $id) {
            shortid
            name
            title
            category
            course
            subjects
            year
            rating
            resources {
                shortid
                name
                title
                format
                url
                dateUp
            }
            conspects {
                shortid
                name
                text
                category
                semester
                image
                likes
            }
        }
    }
`

export const addMaterialResourceM = gql`
    mutation addMaterialResource($name: String!, $id: String!, $title: String!, $format: String!, $url: String!, $dateUp: String!) {
        addMaterialResource(name: $name, id: $id, title: $title, format: $format, url: $url, dateUp: $dateUp)
    }
`

export const updateMaterialRatingM = gql`
    mutation updateMaterialRating($name: String!, $id: String!, $rating: Float!) {
        updateMaterialRating(name: $name, id: $id, rating: $rating)
    }
`

export const manageMaterialConspectM = gql`
    mutation manageMaterialConspect($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $semester: String!, $image: String!, $likes: String!, $collId: String!) {
        manageMaterialConspect(name: $name, id: $id, option: $option, text: $text, category: $category, semester: $semester, image: $image, likes: $likes, collId: $collId)
    }
`