import { publishToFacebook } from './facebook';
import { publishToInstagram } from './instagram';
import { publishToLinkedIn } from './linkedin';
import { publishToTwitter } from './twitter';

export const socialPublishers = {
  facebook: publishToFacebook,
  instagram: publishToInstagram,
  linkedin: publishToLinkedIn,
  twitter: publishToTwitter
};
