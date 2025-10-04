/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const verifyGoogleToken = async (token: any) => {
  try {
    // Request user info directly from Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
    );

    // If the token is valid, Google returns user info
    return response.data; // { id, email, name, picture, ... }
  } catch (error: any) {
    console.error(
      'Invalid Google token',
      error.response?.data || error.message,
    );
    return null;
  }
};

export const verifyGithubToken = async (token: any) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { login, id, avatar_url, email, name, ... }
  } catch (error: any) {
    console.error(
      'Invalid GitHub token',
      error.response?.data || error.message,
    );
    return null;
  }
};
