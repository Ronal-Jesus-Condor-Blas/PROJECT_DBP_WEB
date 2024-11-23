// components/CommentsModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentResponseDto } from "@/Api";

interface CommentsModalProps {
    open: boolean;
    onClose: () => void;
    comments: CommentResponseDto[];
    newCommentContent: string;
    setNewCommentContent: (value: string) => void;
    handleAddComment: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
    open,
    onClose,
    comments,
    newCommentContent,
    setNewCommentContent,
    handleAddComment,
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Comentarios</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.commentId} className="p-2 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-700">{comment.content}</p>
                                <p className="text-xs text-gray-500">Por usuario {comment.userId}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay comentarios.</p>
                    )}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Nuevo Comentario</label>
                        <Textarea
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button onClick={handleAddComment}>Agregar Comentario</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommentsModal;
