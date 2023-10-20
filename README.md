# Facebook Clone

A simple Facebook clone built with Vue 3, Vite, TailwindCSS, and Firebase.

<p align="center">
  <img alt="Stars" src="https://badgen.net/github/stars/meewmeew/facebook-clone">
  <img alt="Forks" src="https://badgen.net/github/forks/meewmeew/facebook-clone">
  <img alt="Issues" src="https://badgen.net/github/issues/meewmeew/facebook-clone">
  <img alt="Commits" src="https://badgen.net/github/commits/meewmeew/facebook-clone">
</p>

## Live Demo
Official Website: [https://mb.mew.id.vn](https://mb.mew.id.vn)

## Main Technologies Used

- Vue 3, TypeScript, Vite, TailwindCSS
- Firebase (Authentication, Firestore)

## Features

- Sign in or register with your email and password.
- Forgot password.
- Create and delete posts.
- Edit and display posts with privacy settings.
- Upload images.
- Like and comment on posts.
- Receive real-time notifications for updates.
- Edit your profile, including changing your avatar and cover image.
- Find and manage your friends.
- Send messages to your friends.
- Enjoy a responsive design.

## Installation

- Clone the repository.
- Install dependencies:

```bash
npm install
```

- Create a Firebase project and add a web app to it.
- Copy the Firebase API key to the .env file:
- Backend source code: [MeewMeew/facebook-clone-be](https://github.com/MeewMeew/facebook-clone-be)

```bash
VITE_FIREBASE_CONFIG=your_config
VITE_API_URL=your_api_url
```

- Enable Firestore and email/password authentication in the Firebase console.
- Run the app:

```bash
npm run dev
```