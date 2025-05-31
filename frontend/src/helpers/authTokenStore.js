let accessToken = null

export const storeAccessToken = (token) => {
    accessToken = token
}

export const getAccessToken = () => accessToken