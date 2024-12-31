"use client";
import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  EmailIcon
} from 'react-share';

const SocialShare = ({ url, title, media }) => {


    
  return (
    <div className="flex mt-4 social-share gap-x-2">
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

        <PinterestShareButton url={url} media={media} description={title}>
            <PinterestIcon size={32} round />
        </PinterestShareButton>
      
      <EmailShareButton url={url} subject={title}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    
    </div>
  );
};

export default SocialShare;