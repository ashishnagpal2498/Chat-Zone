import firebase from 'firebase'
export const getProfilePicUrl = () => {
    return firebase.auth().currentUser.photoURL;
}

export const getUserName = () => {
    return firebase.auth().currentUser.displayName;
}
export const isAuthenticated = () => {
    return !!firebase.auth().currentUser;
}
export const getUserToken = () => {
    return firebase.auth().currentUser.token
}