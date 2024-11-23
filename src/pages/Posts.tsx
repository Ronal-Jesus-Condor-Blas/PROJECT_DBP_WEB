import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/AuthContext";
import {
    getAllPosts,
    createPost,
    deletePost,
    getCommentsByPostId,
    createComment,
    Post,
    PostRequestDto,
    CommentResponseDto,
} from "@/Api";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommentsModal from "@/components/CommentsModal";
import EditPostModal from "@/components/EditPostModal";
import PostsList from "@/components/PostList";

const Posts: React.FC = () => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedPostComments, setSelectedPostComments] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [newCommentContent, setNewCommentContent] = useState<string>("");

    const [formData, setFormData] = useState<PostRequestDto>({
        title: "",
        content: "",
        userId: Number(user?.userId) || 0,
        status: "ACTIVE",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!token) return;
            try {
                const fetchedPosts = await getAllPosts(token);
                setPosts(fetchedPosts);
                console.log("Posts fetched:", fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    const fetchComments = async (postId: number) => {
        try {
            const fetchedComments = await getCommentsByPostId(postId, token!);
            setComments(fetchedComments);
            setSelectedPostComments(postId);
            setCommentModalOpen(true);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async () => {
        if (!token || !user || !selectedPostComments) return;
        try {
            const newComment = {
                userId: Number(user.userId),
                postId: selectedPostComments,
                content: newCommentContent,
            };
            const savedComment = await createComment(newComment, token);
            setComments((prevComments) => [...prevComments, savedComment]);
            setNewCommentContent("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleCreateOrEditPost = async () => {
        if (!user || !token) return;

        try {
            const savedPost = await createPost(formData, image, token);

            setPosts((prevPosts) =>
                selectedPost
                    ? prevPosts.map((post) => (post.postId === savedPost.postId ? savedPost : post))
                    : [savedPost, ...prevPosts]
            );

            setEditModalOpen(false);
            setSelectedPost(null);
            setFormData({ title: "", content: "", userId: Number(user.userId), status: "ACTIVE" });
            setImage(null);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative flex flex-col items-center">
            {/* Botón de regreso */}
            <Button
                className="absolute top-4 left-4 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md"
                onClick={() => navigate("/")}
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </Button>

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-12 w-full max-w-3xl space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Publicaciones</h1>
                <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold flex items-center"
                    onClick={() => setEditModalOpen(true)}
                >
                    <FaPlus className="mr-2" /> Nueva Publicación
                </Button>
            </div>

            {/* Contenedor de publicaciones (scrollable) */}
            <div className="flex-1 w-full max-w-3xl overflow-y-auto pb-6">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando publicaciones...</p>
                ) : (
                    <PostsList
                        posts={posts}
                        onEdit={(post: Post) => {
                            setSelectedPost(post);
                            setFormData({
                                title: post.title,
                                content: post.content,
                                userId: post.userId,
                                status: post.status,
                            });
                            setEditModalOpen(true);
                        }}
                        onDelete={(postId: number) => deletePost(postId)}
                        onViewComments={(postId: number) => fetchComments(postId)}
                    />
                )}
            </div>

            {/* Modales */}
            <CommentsModal
                open={isCommentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                comments={comments}
                newCommentContent={newCommentContent}
                setNewCommentContent={setNewCommentContent}
                handleAddComment={handleAddComment}
            />

            <EditPostModal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleCreateOrEditPost}
                image={image}
                setImage={setImage}
                isEditing={!!selectedPost}
            />
        </div>
    );
};

export default Posts;
