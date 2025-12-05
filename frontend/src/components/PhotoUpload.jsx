import { useState } from 'react';
import axios from 'axios';
import { Upload, X } from 'lucide-react';

const PhotoUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/upload-photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            onUploadSuccess(data.photoUrl);
            setPreview(null); // Clear preview after success
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer overflow-hidden group">
            <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
                disabled={uploading}
            />

            {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
            ) : (
                <div className="text-center text-gray-400 group-hover:text-purple-400">
                    <Upload size={24} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">Add Photo</span>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;
