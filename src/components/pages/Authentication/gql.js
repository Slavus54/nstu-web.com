import {gql} from '@apollo/client'

export const registerProfileM = gql`
    mutation registerProfile($name: String!, $email: String!, $password: String!, $region: String!, $cords: ICord!, $status: String!, $points: Float!, $image: String!, $timestamp: String!) {
        registerProfile(name: $name, email: $email, password: $password, region: $region, cords: $cords, status: $status, points: $points, image: $image, timestamp: $timestamp) {
            shortid
            name
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($name: String!, $password: String!, $timestamp: String!) {
        loginProfile(name: $name, password: $password, timestamp: $timestamp) {
            shortid
            name
        }
    }
`