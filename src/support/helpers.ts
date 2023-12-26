/**
 * A fake function to fetch a user
 */
export const fetchUser = async (id: string) => {
  return {
    id,
    firstName: 'John',
    lastName: 'Doe',
  };
};

/**
 * A fake function to fetch a post
 */
export const fetchPost = async (id: string) => {
  return {
    id,
    title: 'Hello World',
    body: 'This is a post that is great and is excessively long, much too long for an excerpt.',
  };
};

/**
 * A fake function to create a user
 */
export const createUser = (
  user: {
    name: string;
    email: string;
  },
  opts?: {
    throwOnError?: boolean;
  },
): Promise<{
  id: string;
  name: string;
  email: string;
}> => {
  return fetch('/user', {
    method: 'POST',
    body: JSON.stringify(user),
  }).then((response) => response.json());
};

export const getAnimatingState = (): string => {
  if (Math.random() > 0.5) {
    return 'before-animation';
  }

  if (Math.random() > 0.5) {
    return 'animating';
  }

  return 'after-animation';
};

/**
 * A fake video fetcher.
 */
export const fetchVideo = (src: string) => {
  return fetch(src).then((response) => response.blob());
};

/**
 * A fake video appender.
 */
export const appendVideoToDomAndPlay = (blob: Blob) => {
  const video = document.createElement('video');
  video.src = URL.createObjectURL(blob);
  video.play();
};
