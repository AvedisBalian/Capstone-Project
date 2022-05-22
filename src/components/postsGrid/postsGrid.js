import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { FirebaseService } from '../../services/FirebaseService';
import Post from '../post/post';
import './postsGrid.css';

const PostsGrid = ({ title, description, authorId, category }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const postsUnsubscribe = React.useRef();

  useEffect(() => {
    setIsLoading(true);

    postsUnsubscribe.current && postsUnsubscribe.current();

    postsUnsubscribe.current = FirebaseService.onPostsChange(
      async (posts) => {
        setIsLoading(false);
        setPosts(posts);
      },
      authorId,
      category
    );
  }, [authorId, category]);

  return (
    <div className="posts-grid">
      <h2>{title}</h2>

      <p>{description}</p>

      <div>
        {isLoading && (
          <div className="posts-grid-loading">
            <CircularProgress />
          </div>
        )}
        {!isLoading && !posts.length && <div className="posts-grid-placeholder">Nothing to see here</div>}
        {!isLoading &&
          !!posts.length &&
          posts.map((post) => {
            return (
              <Post
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                image={post.image}
                authorId={post.authorId}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PostsGrid;
