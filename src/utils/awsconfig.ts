import { ResourcesConfig } from "aws-amplify";

export const awsConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            identityPoolId: import.meta.env.VITE_AWSCONFIG_IDENTITY_POOL_ID!,
            userPoolId: import.meta.env.VITE_AWSCONFIG_USER_POOL_ID!,
            loginWith: {
                email: true,
            },
            userPoolClientId: import.meta.env.VITE_AWSCONFIG_USER_POOL_WEB_ID!,
            allowGuestAccess: false,
            //userPoolEndpoint:import.meta.env.VITE_AWSCONFIG_USER_POOL_ID!,
        },
    },
    Analytics: {    
        Pinpoint: {
            appId: import.meta.env.VITE_AWSPN_APP_ID!,
            region: import.meta.env.VITE_AWSPN_REGION!,
        },
    },
}

export const awsServerConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            identityPoolId: import.meta.env.AWSCONFIG_IDENTITY_POOL_ID!,
            userPoolId: import.meta.env.AWSCONFIG_USER_POOL_ID!,
            loginWith: {
                email: true,
            },
            userPoolClientId: import.meta.env.AWSCONFIG_USER_POOL_WEB_ID!,
            allowGuestAccess: false,
            //userPoolEndpoint:import.meta.env.AWSCONFIG_USER_POOL_ID!,
        },
    },
    Analytics: {    
        Pinpoint: {
            appId: import.meta.env.AWSPN_APP_ID!,
            region: import.meta.env.AWSPN_REGION!,
        },
    },
}