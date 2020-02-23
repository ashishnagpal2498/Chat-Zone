import firebase from 'firebase'
export const getProfilePicUrl = () => {
    // TODO 4: Return the user's profile pic URL.
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';

}

// Returns the signed-in user's display name.
export const getUserName = () => {
    //Return the user's display name.
    return firebase.auth().currentUser.displayName;
}
export const isAuthenticated = () => {
    //Return true if a user is signed-in.
    // console.log('This Authenticated')
    console.log('Current User',firebase.auth().currentUser)
    return !!firebase.auth().currentUser;
}
export const getUserToken = () => {
    return firebase.auth().currentUser.token
}