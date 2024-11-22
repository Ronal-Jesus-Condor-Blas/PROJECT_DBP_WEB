import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  postId: number;
  title: string;
  content: string;
  image: string;
  createdDate: string;
  status: string;
  userId: number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.postId}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.image && <img src={post.image} alt={post.title} />}
          <p>Posted on: {new Date(post.createdDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;